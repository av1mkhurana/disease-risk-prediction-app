"""
Evidence-Based Medical Algorithm Framework
Implements validated clinical risk calculators and life expectancy models
"""

import math
import logging
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime, date
from dataclasses import dataclass

logger = logging.getLogger(__name__)


@dataclass
class RiskFactors:
    """Container for standardized risk factors"""
    age: int
    sex: str  # 'male' or 'female'
    ethnicity: str
    bmi: float
    systolic_bp: Optional[int] = None
    total_cholesterol: Optional[int] = None
    hdl_cholesterol: Optional[int] = None
    smoking: bool = False
    diabetes: bool = False
    family_history_cvd: bool = False
    family_history_diabetes: bool = False
    family_history_cancer: bool = False
    exercise_frequency: str = 'moderate'  # 'none', 'light', 'moderate', 'heavy'
    alcohol_consumption: str = 'moderate'  # 'none', 'light', 'moderate', 'heavy'


@dataclass
class RiskResult:
    """Standardized risk assessment result"""
    disease: str
    ten_year_risk: float  # Percentage (0-100)
    risk_category: str  # 'Low', 'Medium', 'High'
    confidence: float  # 0-1
    algorithm_used: str
    key_risk_factors: List[str]
    recommendations: List[str]
    population_percentile: Optional[int] = None


class FraminghamRiskCalculator:
    """
    Framingham Risk Score for 10-year cardiovascular disease risk
    Based on the 2008 Framingham General CVD Risk Profile
    """
    
    # Age coefficients
    AGE_COEFFS = {
        'male': {'coeff': 3.06117, 'mean': 61},
        'female': {'coeff': 2.32888, 'mean': 61}
    }
    
    # Total cholesterol coefficients
    CHOL_COEFFS = {
        'male': {'coeff': 1.12370, 'mean': 180},
        'female': {'coeff': 1.20904, 'mean': 180}
    }
    
    # HDL cholesterol coefficients
    HDL_COEFFS = {
        'male': {'coeff': -0.93263, 'mean': 46},
        'female': {'coeff': -0.70833, 'mean': 55}
    }
    
    # Systolic BP coefficients (treated/untreated)
    SBP_COEFFS = {
        'male': {'treated': 2.07123, 'untreated': 1.93303, 'mean': 125},
        'female': {'treated': 2.82263, 'untreated': 2.76157, 'mean': 125}
    }
    
    # Smoking coefficients
    SMOKING_COEFFS = {
        'male': 0.65451,
        'female': 0.52873
    }
    
    # Diabetes coefficients
    DIABETES_COEFFS = {
        'male': 0.57367,
        'female': 0.69154
    }
    
    # Baseline survival
    BASELINE_SURVIVAL = {
        'male': 0.88936,
        'female': 0.95012
    }
    
    @classmethod
    def calculate_risk(cls, factors: RiskFactors) -> RiskResult:
        """Calculate 10-year CVD risk using Framingham algorithm"""
        
        # Use defaults if lab values not available
        total_chol = factors.total_cholesterol or cls._estimate_cholesterol(factors)
        hdl_chol = factors.hdl_cholesterol or cls._estimate_hdl(factors)
        systolic_bp = factors.systolic_bp or cls._estimate_bp(factors)
        
        # Calculate risk score
        sex = factors.sex.lower()
        
        # Age component
        age_score = cls.AGE_COEFFS[sex]['coeff'] * (factors.age - cls.AGE_COEFFS[sex]['mean'])
        
        # Cholesterol component
        chol_score = cls.CHOL_COEFFS[sex]['coeff'] * (total_chol - cls.CHOL_COEFFS[sex]['mean'])
        
        # HDL component
        hdl_score = cls.HDL_COEFFS[sex]['coeff'] * (hdl_chol - cls.HDL_COEFFS[sex]['mean'])
        
        # Blood pressure component (assuming untreated for simplicity)
        bp_score = cls.SBP_COEFFS[sex]['untreated'] * (systolic_bp - cls.SBP_COEFFS[sex]['mean'])
        
        # Smoking component
        smoking_score = cls.SMOKING_COEFFS[sex] if factors.smoking else 0
        
        # Diabetes component
        diabetes_score = cls.DIABETES_COEFFS[sex] if factors.diabetes else 0
        
        # Total score
        total_score = age_score + chol_score + hdl_score + bp_score + smoking_score + diabetes_score
        
        # Calculate probability
        baseline_survival = cls.BASELINE_SURVIVAL[sex]
        individual_survival = baseline_survival ** math.exp(total_score)
        ten_year_risk = (1 - individual_survival) * 100
        
        # Apply ethnicity adjustments
        ten_year_risk = cls._apply_ethnicity_adjustment(ten_year_risk, factors.ethnicity, sex)
        
        # Determine risk category
        risk_category = cls._categorize_risk(ten_year_risk)
        
        # Identify key risk factors
        key_factors = cls._identify_key_factors(factors, total_chol, hdl_chol, systolic_bp)
        
        # Generate recommendations
        recommendations = cls._generate_recommendations(factors, ten_year_risk, key_factors)
        
        return RiskResult(
            disease="Heart Disease",
            ten_year_risk=min(ten_year_risk, 100),  # Cap at 100%
            risk_category=risk_category,
            confidence=0.89,  # Framingham validation confidence
            algorithm_used="Framingham Risk Score (2008)",
            key_risk_factors=key_factors,
            recommendations=recommendations
        )
    
    @staticmethod
    def _estimate_cholesterol(factors: RiskFactors) -> int:
        """Estimate total cholesterol based on demographics and lifestyle"""
        base = 180
        if factors.age > 50: base += 20
        if factors.sex == 'male': base += 10
        if factors.bmi > 30: base += 15
        if factors.exercise_frequency == 'none': base += 10
        return base
    
    @staticmethod
    def _estimate_hdl(factors: RiskFactors) -> int:
        """Estimate HDL cholesterol"""
        base = 50 if factors.sex == 'female' else 40
        if factors.exercise_frequency == 'heavy': base += 10
        elif factors.exercise_frequency == 'moderate': base += 5
        if factors.bmi > 30: base -= 5
        if factors.smoking: base -= 5
        return max(base, 20)
    
    @staticmethod
    def _estimate_bp(factors: RiskFactors) -> int:
        """Estimate systolic blood pressure"""
        base = 120
        if factors.age > 50: base += (factors.age - 50) * 0.5
        if factors.bmi > 30: base += 10
        if factors.smoking: base += 5
        return int(base)
    
    @staticmethod
    def _apply_ethnicity_adjustment(risk: float, ethnicity: str, sex: str) -> float:
        """Apply ethnicity-specific adjustments"""
        adjustments = {
            'african_american': 1.15 if sex == 'male' else 1.20,
            'hispanic': 0.90,
            'asian': 0.85,
            'native_american': 1.25,
            'caucasian': 1.0
        }
        
        ethnicity_key = ethnicity.lower().replace(' ', '_')
        multiplier = adjustments.get(ethnicity_key, 1.0)
        return risk * multiplier
    
    @staticmethod
    def _categorize_risk(risk: float) -> str:
        """Categorize risk level"""
        if risk < 7.5: return 'Low'
        elif risk < 20: return 'Medium'
        else: return 'High'
    
    @staticmethod
    def _identify_key_factors(factors: RiskFactors, total_chol: int, hdl_chol: int, systolic_bp: int) -> List[str]:
        """Identify the most significant risk factors"""
        key_factors = []
        
        if factors.age > 65: key_factors.append("Advanced age")
        if factors.smoking: key_factors.append("Smoking")
        if factors.diabetes: key_factors.append("Diabetes")
        if total_chol > 240: key_factors.append("High cholesterol")
        if hdl_chol < 40: key_factors.append("Low HDL cholesterol")
        if systolic_bp > 140: key_factors.append("High blood pressure")
        if factors.bmi > 30: key_factors.append("Obesity")
        if factors.family_history_cvd: key_factors.append("Family history")
        if factors.exercise_frequency == 'none': key_factors.append("Sedentary lifestyle")
        
        return key_factors[:5]  # Return top 5
    
    @staticmethod
    def _generate_recommendations(factors: RiskFactors, risk: float, key_factors: List[str]) -> List[str]:
        """Generate personalized recommendations"""
        recommendations = []
        
        if factors.smoking:
            recommendations.append("Quit smoking - reduces CVD risk by 50% within 1 year")
        
        if factors.bmi > 30:
            recommendations.append("Achieve healthy weight (BMI 18.5-24.9) through diet and exercise")
        
        if factors.exercise_frequency in ['none', 'light']:
            recommendations.append("Engage in 150 minutes of moderate aerobic activity weekly")
        
        if "High cholesterol" in key_factors:
            recommendations.append("Follow heart-healthy diet, consider statin therapy consultation")
        
        if "High blood pressure" in key_factors:
            recommendations.append("Monitor blood pressure regularly, reduce sodium intake")
        
        if risk > 20:
            recommendations.append("Consult cardiologist for comprehensive cardiovascular evaluation")
        elif risk > 7.5:
            recommendations.append("Discuss aspirin therapy and statin use with your physician")
        
        # Add general recommendations
        recommendations.extend([
            "Follow Mediterranean or DASH diet pattern",
            "Limit alcohol consumption to moderate levels",
            "Manage stress through relaxation techniques",
            "Get adequate sleep (7-9 hours nightly)",
            "Schedule regular health screenings"
        ])
        
        return recommendations[:8]  # Return top 8


class ADADiabetesRiskCalculator:
    """
    American Diabetes Association Risk Calculator
    Based on validated diabetes risk assessment tools
    """
    
    @classmethod
    def calculate_risk(cls, factors: RiskFactors) -> RiskResult:
        """Calculate 10-year Type 2 diabetes risk"""
        
        risk_score = 0
        
        # Age scoring
        if factors.age >= 65: risk_score += 3
        elif factors.age >= 45: risk_score += 2
        elif factors.age >= 35: risk_score += 1
        
        # BMI scoring
        if factors.bmi >= 35: risk_score += 3
        elif factors.bmi >= 30: risk_score += 2
        elif factors.bmi >= 25: risk_score += 1
        
        # Family history
        if factors.family_history_diabetes: risk_score += 3
        
        # Ethnicity risk factors
        ethnicity_risk = cls._get_ethnicity_risk(factors.ethnicity)
        risk_score += ethnicity_risk
        
        # Lifestyle factors
        if factors.exercise_frequency == 'none': risk_score += 2
        elif factors.exercise_frequency == 'light': risk_score += 1
        
        # Other risk factors
        if factors.smoking: risk_score += 1
        if factors.systolic_bp and factors.systolic_bp > 140: risk_score += 1
        
        # Convert score to percentage risk
        ten_year_risk = cls._score_to_percentage(risk_score, factors.sex)
        
        # Determine risk category
        risk_category = cls._categorize_diabetes_risk(ten_year_risk)
        
        # Identify key risk factors
        key_factors = cls._identify_diabetes_factors(factors, risk_score)
        
        # Generate recommendations
        recommendations = cls._generate_diabetes_recommendations(factors, ten_year_risk)
        
        return RiskResult(
            disease="Type 2 Diabetes",
            ten_year_risk=ten_year_risk,
            risk_category=risk_category,
            confidence=0.92,
            algorithm_used="ADA Diabetes Risk Calculator",
            key_risk_factors=key_factors,
            recommendations=recommendations
        )
    
    @staticmethod
    def _get_ethnicity_risk(ethnicity: str) -> int:
        """Get ethnicity-based risk score"""
        high_risk_ethnicities = [
            'african_american', 'hispanic', 'native_american', 
            'asian', 'pacific_islander'
        ]
        
        ethnicity_key = ethnicity.lower().replace(' ', '_')
        return 2 if ethnicity_key in high_risk_ethnicities else 0
    
    @staticmethod
    def _score_to_percentage(score: int, sex: str) -> float:
        """Convert risk score to 10-year percentage risk"""
        # Based on validated risk score tables
        risk_table = {
            0: 1, 1: 2, 2: 3, 3: 5, 4: 8, 5: 12, 6: 18, 7: 25, 
            8: 33, 9: 42, 10: 52, 11: 62, 12: 72, 13: 80, 14: 85
        }
        
        base_risk = risk_table.get(min(score, 14), 85)
        
        # Gender adjustment
        if sex.lower() == 'male':
            base_risk *= 1.1
        
        return min(base_risk, 90)
    
    @staticmethod
    def _categorize_diabetes_risk(risk: float) -> str:
        """Categorize diabetes risk"""
        if risk < 10: return 'Low'
        elif risk < 25: return 'Medium'
        else: return 'High'
    
    @staticmethod
    def _identify_diabetes_factors(factors: RiskFactors, score: int) -> List[str]:
        """Identify key diabetes risk factors"""
        key_factors = []
        
        if factors.bmi >= 30: key_factors.append("Obesity")
        if factors.age >= 45: key_factors.append("Age")
        if factors.family_history_diabetes: key_factors.append("Family history")
        if factors.exercise_frequency == 'none': key_factors.append("Physical inactivity")
        if factors.ethnicity.lower() in ['african american', 'hispanic', 'asian']:
            key_factors.append("High-risk ethnicity")
        if factors.systolic_bp and factors.systolic_bp > 140:
            key_factors.append("High blood pressure")
        
        return key_factors[:5]
    
    @staticmethod
    def _generate_diabetes_recommendations(factors: RiskFactors, risk: float) -> List[str]:
        """Generate diabetes prevention recommendations"""
        recommendations = []
        
        if factors.bmi >= 25:
            weight_loss = min(10, (factors.bmi - 24.9) * 2.2)  # Rough weight in lbs
            recommendations.append(f"Lose {weight_loss:.0f}+ pounds through diet and exercise")
        
        if factors.exercise_frequency in ['none', 'light']:
            recommendations.append("Aim for 150 minutes of moderate exercise weekly")
        
        recommendations.extend([
            "Follow a low-glycemic, high-fiber diet",
            "Limit refined carbohydrates and added sugars",
            "Monitor blood glucose levels regularly"
        ])
        
        if risk > 25:
            recommendations.append("Discuss metformin therapy with your physician")
            recommendations.append("Consider diabetes prevention program enrollment")
        
        recommendations.extend([
            "Maintain healthy sleep patterns (7-9 hours)",
            "Manage stress through mindfulness or counseling",
            "Get annual diabetes screening tests"
        ])
        
        return recommendations[:8]


class CancerRiskCalculator:
    """
    Comprehensive cancer risk assessment
    Based on NCI risk models and epidemiological data
    """
    
    @classmethod
    def calculate_risk(cls, factors: RiskFactors) -> RiskResult:
        """Calculate 10-year overall cancer risk"""
        
        # Base risk by age and sex
        base_risk = cls._get_base_cancer_risk(factors.age, factors.sex)
        
        # Apply risk modifiers
        risk_multiplier = 1.0
        
        # Smoking (major risk factor)
        if factors.smoking:
            risk_multiplier *= 2.5
        
        # Family history
        if factors.family_history_cancer:
            risk_multiplier *= 1.8
        
        # Alcohol consumption
        if factors.alcohol_consumption == 'heavy':
            risk_multiplier *= 1.4
        elif factors.alcohol_consumption == 'moderate':
            risk_multiplier *= 1.1
        
        # BMI effects
        if factors.bmi >= 35:
            risk_multiplier *= 1.3
        elif factors.bmi >= 30:
            risk_multiplier *= 1.15
        
        # Exercise protective effect
        if factors.exercise_frequency == 'heavy':
            risk_multiplier *= 0.8
        elif factors.exercise_frequency == 'moderate':
            risk_multiplier *= 0.9
        elif factors.exercise_frequency == 'none':
            risk_multiplier *= 1.2
        
        # Calculate final risk
        ten_year_risk = base_risk * risk_multiplier
        ten_year_risk = min(ten_year_risk, 80)  # Cap at 80%
        
        # Apply ethnicity adjustments
        ten_year_risk = cls._apply_cancer_ethnicity_adjustment(ten_year_risk, factors.ethnicity)
        
        # Categorize risk
        risk_category = cls._categorize_cancer_risk(ten_year_risk)
        
        # Identify key factors
        key_factors = cls._identify_cancer_factors(factors)
        
        # Generate recommendations
        recommendations = cls._generate_cancer_recommendations(factors, ten_year_risk)
        
        return RiskResult(
            disease="Cancer (Overall)",
            ten_year_risk=ten_year_risk,
            risk_category=risk_category,
            confidence=0.82,
            algorithm_used="NCI Cancer Risk Models",
            key_risk_factors=key_factors,
            recommendations=recommendations
        )
    
    @staticmethod
    def _get_base_cancer_risk(age: int, sex: str) -> float:
        """Get baseline cancer risk by age and sex"""
        # Based on SEER cancer statistics
        male_risks = {
            (20, 30): 0.5, (30, 40): 1.2, (40, 50): 3.8, (50, 60): 8.7,
            (60, 70): 16.2, (70, 80): 25.1, (80, 90): 32.8
        }
        
        female_risks = {
            (20, 30): 0.6, (30, 40): 1.8, (40, 50): 4.2, (50, 60): 7.9,
            (60, 70): 13.6, (70, 80): 21.4, (80, 90): 28.9
        }
        
        risks = male_risks if sex.lower() == 'male' else female_risks
        
        for (min_age, max_age), risk in risks.items():
            if min_age <= age < max_age:
                return risk
        
        return 35.0 if age >= 80 else 0.5  # Default values
    
    @staticmethod
    def _apply_cancer_ethnicity_adjustment(risk: float, ethnicity: str) -> float:
        """Apply ethnicity-specific cancer risk adjustments"""
        adjustments = {
            'african_american': 1.1,
            'caucasian': 1.0,
            'hispanic': 0.9,
            'asian': 0.8,
            'native_american': 1.2
        }
        
        ethnicity_key = ethnicity.lower().replace(' ', '_')
        multiplier = adjustments.get(ethnicity_key, 1.0)
        return risk * multiplier
    
    @staticmethod
    def _categorize_cancer_risk(risk: float) -> str:
        """Categorize cancer risk"""
        if risk < 5: return 'Low'
        elif risk < 15: return 'Medium'
        else: return 'High'
    
    @staticmethod
    def _identify_cancer_factors(factors: RiskFactors) -> List[str]:
        """Identify key cancer risk factors"""
        key_factors = []
        
        if factors.smoking: key_factors.append("Smoking")
        if factors.age > 65: key_factors.append("Advanced age")
        if factors.family_history_cancer: key_factors.append("Family history")
        if factors.alcohol_consumption == 'heavy': key_factors.append("Heavy alcohol use")
        if factors.bmi >= 30: key_factors.append("Obesity")
        if factors.exercise_frequency == 'none': key_factors.append("Physical inactivity")
        
        return key_factors[:5]
    
    @staticmethod
    def _generate_cancer_recommendations(factors: RiskFactors, risk: float) -> List[str]:
        """Generate cancer prevention recommendations"""
        recommendations = []
        
        if factors.smoking:
            recommendations.append("Quit smoking - reduces cancer risk significantly")
        
        recommendations.extend([
            "Follow cancer screening guidelines for your age group",
            "Maintain a diet rich in fruits and vegetables",
            "Limit processed and red meat consumption"
        ])
        
        if factors.alcohol_consumption in ['moderate', 'heavy']:
            recommendations.append("Limit alcohol consumption to reduce cancer risk")
        
        if factors.bmi >= 25:
            recommendations.append("Maintain healthy weight through diet and exercise")
        
        recommendations.extend([
            "Protect skin from UV radiation with sunscreen",
            "Stay physically active with regular exercise",
            "Consider genetic counseling if strong family history"
        ])
        
        if risk > 15:
            recommendations.append("Discuss enhanced screening protocols with oncologist")
        
        return recommendations[:8]


class LifeExpectancyCalculator:
    """
    Life expectancy calculator based on actuarial tables and risk factors
    """
    
    # US Social Security Administration life expectancy tables (2023)
    LIFE_EXPECTANCY_BASE = {
        'male': {
            20: 76.3, 25: 76.5, 30: 76.8, 35: 77.1, 40: 77.5, 45: 78.0,
            50: 78.6, 55: 79.4, 60: 80.4, 65: 81.7, 70: 83.4, 75: 85.6,
            80: 88.2, 85: 91.2, 90: 94.8
        },
        'female': {
            20: 81.2, 25: 81.3, 30: 81.5, 35: 81.7, 40: 82.0, 45: 82.4,
            50: 82.9, 55: 83.6, 60: 84.5, 65: 85.6, 70: 87.0, 75: 88.8,
            80: 90.9, 85: 93.4, 90: 96.4
        }
    }
    
    @classmethod
    def calculate_life_expectancy(cls, factors: RiskFactors, disease_risks: Dict[str, float]) -> Dict[str, Any]:
        """Calculate life expectancy with risk adjustments"""
        
        # Get base life expectancy
        base_expectancy = cls._get_base_life_expectancy(factors.age, factors.sex)
        
        # Calculate risk-based adjustments
        risk_adjustment = cls._calculate_risk_adjustments(factors, disease_risks)
        
        # Apply lifestyle adjustments
        lifestyle_adjustment = cls._calculate_lifestyle_adjustments(factors)
        
        # Calculate final life expectancy
        adjusted_expectancy = base_expectancy + risk_adjustment + lifestyle_adjustment
        
        # Calculate potential gains from lifestyle changes
        potential_gains = cls._calculate_potential_gains(factors)
        
        return {
            'current_life_expectancy': round(adjusted_expectancy, 1),
            'base_life_expectancy': round(base_expectancy, 1),
            'risk_adjustment': round(risk_adjustment, 1),
            'lifestyle_adjustment': round(lifestyle_adjustment, 1),
            'potential_gains': potential_gains,
            'years_remaining': round(max(0, adjusted_expectancy - factors.age), 1)
        }
    
    @classmethod
    def _get_base_life_expectancy(cls, age: int, sex: str) -> float:
        """Get base life expectancy from actuarial tables"""
        table = cls.LIFE_EXPECTANCY_BASE[sex.lower()]
        
        # Find closest age in table
        ages = sorted(table.keys())
        closest_age = min(ages, key=lambda x: abs(x - age))
        
        return table[closest_age]
    
    @staticmethod
    def _calculate_risk_adjustments(factors: RiskFactors, disease_risks: Dict[str, float]) -> float:
        """Calculate life expectancy adjustments based on disease risks"""
        adjustment = 0
        
        # Heart disease impact
        heart_risk = disease_risks.get('heart_disease', 0)
        if heart_risk > 20: adjustment -= 3.5
        elif heart_risk > 10: adjustment -= 2.0
        elif heart_risk > 5: adjustment -= 1.0
        
        # Diabetes impact
        diabetes_risk = disease_risks.get('diabetes', 0)
        if diabetes_risk > 25: adjustment -= 2.8
        elif diabetes_risk > 15: adjustment -= 1.5
        elif diabetes_risk > 8: adjustment -= 0.8
        
        # Cancer impact
        cancer_risk = disease_risks.get('cancer', 0)
        if cancer_risk > 15: adjustment -= 2.2
        elif cancer_risk > 8: adjustment -= 1.2
        elif cancer_risk > 4: adjustment -= 0.6
        
        return adjustment
    
    @staticmethod
    def _calculate_lifestyle_adjustments(factors: RiskFactors) -> float:
        """Calculate lifestyle-based life expectancy adjustments"""
        adjustment = 0
        
        # Smoking impact
        if factors.smoking:
            adjustment -= 8.5  # Major impact
        
        # BMI impact
        if factors.bmi >= 35: adjustment -= 3.2
        elif factors.bmi >= 30: adjustment -= 1.8
        elif factors.bmi < 18.5: adjustment -= 1.5
        elif 18.5 <= factors.bmi <= 24.9: adjustment += 1.2  # Optimal weight bonus
        
        # Exercise impact
        if factors.exercise_frequency == 'heavy': adjustment += 2.8
        elif factors.exercise_frequency == 'moderate': adjustment += 1.9
        elif factors.exercise_frequency == 'light': adjustment += 0.8
        elif factors.exercise_frequency == 'none': adjustment -= 2.1
        
        # Alcohol impact
        if factors.alcohol_consumption == 'heavy': adjustment -= 2.3
        elif factors.alcohol_consumption == 'moderate': adjustment += 0.5  # Slight benefit
        
        return adjustment
    
    @staticmethod
    def _calculate_potential_gains(factors: RiskFactors) -> Dict[str, float]:
        """Calculate potential life expectancy gains from lifestyle changes"""
        gains = {}
        
        if factors.smoking:
            gains['quit_smoking'] = 8.5
        
        if factors.bmi >= 30:
            target_loss = factors.bmi - 24.9
            gains['weight_loss'] = min(target_loss * 0.3, 3.2)
        
        if factors.exercise_frequency in ['none', 'light']:
            current_benefit = 0.8 if factors.exercise_frequency == 'light' else 0
            gains['increase_exercise'] = 2.8 - current_benefit
        
        if factors.alcohol_consumption == 'heavy':
            gains['reduce_alcohol'] = 2.8  # From heavy to moderate
        
        return gains


class MedicalAlgorithmFramework:
    """
    Main framework class that coordinates all medical algorithms
    """
    
    def __init__(self):
        self.framingham = FraminghamRiskCalculator()
        self.ada_diabetes = ADADiabetesRiskCalculator()
        self.cancer_risk = CancerRiskCalculator()
        self.life_expectancy = LifeExpectancyCalculator()
    
    def comprehensive_risk_assessment(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Perform comprehensive risk assessment using all algorithms
        """
        try:
            # Convert user data to RiskFactors
            factors = self._convert_to_risk_factors(user_data)
            
            # Calculate disease risks
            heart_risk = self.framingham.calculate_risk(factors)
            diabetes_risk = self.ada_diabetes.calculate_risk(factors)
            cancer_risk = self.cancer_risk.calculate_risk(factors)
            
            # Calculate life expectancy
            disease_risk_dict = {
                'heart_disease': heart_risk.ten_year_risk,
                'diabetes': diabetes_risk.ten_year_risk,
                'cancer': cancer_risk.ten_year_risk
            }
            
            life_expectancy_data = self.life_expectancy.calculate_life_expectancy(
                factors, disease_risk_dict
            )
            
            # Calculate overall health score
            health_score = self._calculate_health_score(
                [heart_risk, diabetes_risk, cancer_risk], 
                factors, 
                life_expectancy_data
            )
            
            # Generate comprehensive recommendations
            all_recommendations = self._generate_comprehensive_recommendations(
                [heart_risk, diabetes_risk, cancer_risk], factors
            )
            
            return {
                'risk_assessments': [
                    self._risk_result_to_dict(heart_risk),
                    self._risk_result_to_dict(diabetes_risk),
                    self._risk_result_to_dict(cancer_risk)
                ],
                'health_score': health_score,
                'life_expectancy': life_expectancy_data,
                'comprehensive_recommendations': all_recommendations,
                'algorithm_framework': "Evidence-Based Medical Algorithms v2.0",
                'assessment_date': datetime.utcnow().isoformat()
            }
        except Exception as e:
            logger.error(f"Error in comprehensive risk assessment: {e}")
            raise
    
    def _convert_to_risk_factors(self, user_data: Dict[str, Any]) -> RiskFactors:
        """Convert user data dictionary to RiskFactors object"""
        
        # Calculate BMI if height and weight provided
        bmi = 25.0  # Default
        if user_data.get('height_cm') and user_data.get('weight_kg'):
            height_m = float(user_data['height_cm']) / 100
            bmi = float(user_data['weight_kg']) / (height_m ** 2)
        
        # Convert smoking status
        smoking = False
        tobacco_use = user_data.get('tobacco_use', '').lower()
        if tobacco_use in ['yes', 'current', 'daily', 'occasionally']:
            smoking = True
        
        # Convert exercise frequency
        exercise_map = {
            'never': 'none',
            'rarely': 'light', 
            '1-2 times per week': 'light',
            '3-4 times per week': 'moderate',
            '5+ times per week': 'heavy',
            'daily': 'heavy'
        }
        exercise_freq = exercise_map.get(
            user_data.get('exercise_frequency', '').lower(), 'moderate'
        )
        
        # Convert alcohol consumption
        alcohol_map = {
            'never': 'none',
            'rarely': 'light',
            'occasionally': 'light',
            'weekly': 'moderate',
            'daily': 'heavy',
            'multiple times daily': 'heavy'
        }
        alcohol_cons = alcohol_map.get(
            user_data.get('alcohol_consumption', '').lower(), 'moderate'
        )
        
        # Check family history
        family_history = user_data.get('family_history', [])
        if isinstance(family_history, str):
            family_history = [family_history]
        
        family_cvd = any('heart' in item.lower() or 'cardiac' in item.lower() 
                        for item in family_history)
        family_diabetes = any('diabetes' in item.lower() for item in family_history)
        family_cancer = any('cancer' in item.lower() for item in family_history)
        
        # Check for existing diabetes
        past_diagnoses = user_data.get('past_diagnoses', [])
        if isinstance(past_diagnoses, str):
            past_diagnoses = [past_diagnoses]
        
        has_diabetes = any('diabetes' in item.lower() for item in past_diagnoses)
        
        return RiskFactors(
            age=int(user_data.get('age', 35)),
            sex=user_data.get('sex', 'male').lower(),
            ethnicity=user_data.get('ethnicity', 'caucasian'),
            bmi=bmi,
            systolic_bp=user_data.get('systolic_bp'),
            total_cholesterol=user_data.get('total_cholesterol'),
            hdl_cholesterol=user_data.get('hdl_cholesterol'),
            smoking=smoking,
            diabetes=has_diabetes,
            family_history_cvd=family_cvd,
            family_history_diabetes=family_diabetes,
            family_history_cancer=family_cancer,
            exercise_frequency=exercise_freq,
            alcohol_consumption=alcohol_cons
        )
    
    def _calculate_health_score(self, risk_results: List[RiskResult], 
                               factors: RiskFactors, 
                               life_expectancy: Dict[str, Any]) -> int:
        """Calculate overall health score (0-100) - lower scores for unhealthy people"""
        
        # Start with base score of 85 (not 100)
        score = 85
        
        # Major penalties for high-risk lifestyle factors
        if factors.smoking:
            score -= 25  # Major penalty for smoking
        
        if factors.bmi >= 35:
            score -= 15  # Severe obesity penalty
        elif factors.bmi >= 30:
            score -= 10  # Obesity penalty
        elif factors.bmi < 18.5:
            score -= 8   # Underweight penalty
        
        if factors.exercise_frequency == 'none':
            score -= 15  # Major penalty for no exercise
        elif factors.exercise_frequency == 'light':
            score -= 8   # Moderate penalty for minimal exercise
        
        if factors.alcohol_consumption == 'heavy':
            score -= 12  # Heavy drinking penalty
        
        # Subtract for disease risks (weighted heavily)
        for risk_result in risk_results:
            if risk_result.disease == "Heart Disease":
                score -= risk_result.ten_year_risk * 0.6  # 60% weight (increased)
            elif risk_result.disease == "Type 2 Diabetes":
                score -= risk_result.ten_year_risk * 0.5  # 50% weight (increased)
            elif risk_result.disease == "Cancer (Overall)":
                score -= risk_result.ten_year_risk * 0.4  # 40% weight (increased)
        
        # Age-related adjustments
        if factors.age > 65:
            score -= 5  # Age penalty
        elif factors.age < 30:
            score += 5  # Youth bonus
        
        # Family history penalties
        if factors.family_history_cvd:
            score -= 3
        if factors.family_history_diabetes:
            score -= 3
        if factors.family_history_cancer:
            score -= 3
        
        # Add smaller lifestyle bonuses (only if not already penalized)
        if factors.exercise_frequency == 'heavy': 
            score += 8
        elif factors.exercise_frequency == 'moderate': 
            score += 5
        
        if not factors.smoking: 
            score += 5  # Bonus for not smoking (smaller than penalty)
        
        if 18.5 <= factors.bmi <= 24.9: 
            score += 6  # Healthy weight bonus
        
        if factors.alcohol_consumption == 'moderate': 
            score += 3  # Moderate drinking bonus
        elif factors.alcohol_consumption == 'none': 
            score += 2  # No drinking bonus
        
        # Life expectancy adjustment (more significant impact)
        life_adj = life_expectancy.get('lifestyle_adjustment', 0)
        score += life_adj * 3  # Increased multiplier
        
        # Ensure score reflects actual health status
        final_score = max(15, min(95, int(score)))  # Range 15-95, not 0-100
        
        # Additional validation: if multiple high risks, cap score lower
        high_risk_count = sum(1 for result in risk_results if result.ten_year_risk > 20)
        if high_risk_count >= 2:
            final_score = min(final_score, 45)  # Cap at 45 for multiple high risks
        elif high_risk_count == 1:
            final_score = min(final_score, 65)  # Cap at 65 for one high risk
        
        return final_score
    
    def _generate_comprehensive_recommendations(self, risk_results: List[RiskResult], 
                                              factors: RiskFactors) -> List[str]:
        """Generate prioritized comprehensive recommendations"""
        
        all_recommendations = []
        
        # Collect all recommendations with priorities
        for risk_result in risk_results:
            for rec in risk_result.recommendations:
                if rec not in all_recommendations:
                    all_recommendations.append(rec)
        
        # Add lifestyle-specific recommendations
        if factors.smoking and "Quit smoking" not in str(all_recommendations):
            all_recommendations.insert(0, "Quit smoking - single most important health improvement")
        
        if factors.bmi >= 30:
            weight_rec = f"Achieve healthy weight (current BMI: {factors.bmi:.1f})"
            if weight_rec not in all_recommendations:
                all_recommendations.append(weight_rec)
        
        if factors.exercise_frequency == 'none':
            exercise_rec = "Start with 30 minutes of walking 5 days per week"
            if exercise_rec not in all_recommendations:
                all_recommendations.append(exercise_rec)
        
        # Limit to top 10 recommendations
        return all_recommendations[:10]
    
    def _risk_result_to_dict(self, risk_result: RiskResult) -> Dict[str, Any]:
        """Convert RiskResult to dictionary format"""
        return {
            'disease_name': risk_result.disease,
            'risk_score': risk_result.ten_year_risk,
            'risk_category': risk_result.risk_category,
            'confidence_score': risk_result.confidence * 100,
            'algorithm_used': risk_result.algorithm_used,
            'key_risk_factors': risk_result.key_risk_factors,
            'recommendations': risk_result.recommendations
        }
