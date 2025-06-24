-- Disease Risk Prediction App - Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor to set up the database

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- Basic information
    full_name TEXT,
    
    -- Demographics (will be encrypted at application level)
    age INTEGER,
    sex TEXT CHECK (sex IN ('male', 'female', 'other')),
    height_cm DECIMAL(5,2),
    weight_kg DECIMAL(5,2),
    ethnicity TEXT,
    
    -- Lifestyle factors
    diet_type TEXT,
    exercise_frequency TEXT,
    sleep_hours DECIMAL(3,1),
    tobacco_use TEXT,
    alcohol_consumption TEXT,
    occupation TEXT,
    environmental_exposures TEXT,
    
    -- Medical history (stored as JSONB for flexibility)
    past_diagnoses JSONB DEFAULT '[]'::jsonb,
    family_history JSONB DEFAULT '[]'::jsonb,
    current_symptoms JSONB DEFAULT '[]'::jsonb,
    medications JSONB DEFAULT '[]'::jsonb,
    
    -- Profile completion status
    demographics_complete BOOLEAN DEFAULT FALSE,
    lifestyle_complete BOOLEAN DEFAULT FALSE,
    medical_history_complete BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one profile per user
    UNIQUE(user_id)
);

-- Create lab_results table
CREATE TABLE IF NOT EXISTS lab_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- Lab test information
    test_name TEXT NOT NULL,
    test_value TEXT NOT NULL, -- Encrypted at application level
    test_unit TEXT,
    reference_range TEXT,
    test_date TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Metadata
    lab_name TEXT,
    doctor_name TEXT,
    notes TEXT, -- Encrypted at application level
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create risk_predictions table
CREATE TABLE IF NOT EXISTS risk_predictions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- Prediction details
    disease_name TEXT NOT NULL,
    risk_score TEXT NOT NULL, -- Encrypted percentage
    risk_category TEXT NOT NULL CHECK (risk_category IN ('Low', 'Medium', 'High')),
    confidence_score TEXT, -- Encrypted
    
    -- Model information
    model_version TEXT NOT NULL,
    features_used JSONB,
    
    -- Recommendations
    recommendations JSONB, -- Encrypted at application level
    
    -- Metadata
    prediction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_lab_results_user_id ON lab_results(user_id);
CREATE INDEX IF NOT EXISTS idx_lab_results_test_date ON lab_results(test_date);
CREATE INDEX IF NOT EXISTS idx_risk_predictions_user_id ON risk_predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_risk_predictions_date ON risk_predictions(prediction_date);
CREATE INDEX IF NOT EXISTS idx_risk_predictions_active ON risk_predictions(is_active);

-- Enable Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_predictions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- User Profiles: Users can only access their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile" ON user_profiles
    FOR DELETE USING (auth.uid() = user_id);

-- Lab Results: Users can only access their own lab results
CREATE POLICY "Users can view own lab results" ON lab_results
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lab results" ON lab_results
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lab results" ON lab_results
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own lab results" ON lab_results
    FOR DELETE USING (auth.uid() = user_id);

-- Risk Predictions: Users can only access their own predictions
CREATE POLICY "Users can view own predictions" ON risk_predictions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own predictions" ON risk_predictions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own predictions" ON risk_predictions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own predictions" ON risk_predictions
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lab_results_updated_at 
    BEFORE UPDATE ON lab_results 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle user profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (user_id, full_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Create a view for user profile completion status
CREATE OR REPLACE VIEW user_profile_status AS
SELECT 
    user_id,
    full_name,
    demographics_complete,
    lifestyle_complete,
    medical_history_complete,
    (demographics_complete AND lifestyle_complete AND medical_history_complete) as profile_complete,
    created_at,
    updated_at
FROM user_profiles;

-- Grant access to the view
GRANT SELECT ON user_profile_status TO authenticated;

-- Create a function to get user's latest predictions
CREATE OR REPLACE FUNCTION get_latest_predictions(user_uuid UUID)
RETURNS TABLE (
    disease_name TEXT,
    risk_score TEXT,
    risk_category TEXT,
    confidence_score TEXT,
    recommendations JSONB,
    prediction_date TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT ON (rp.disease_name)
        rp.disease_name,
        rp.risk_score,
        rp.risk_category,
        rp.confidence_score,
        rp.recommendations,
        rp.prediction_date
    FROM risk_predictions rp
    WHERE rp.user_id = user_uuid AND rp.is_active = TRUE
    ORDER BY rp.disease_name, rp.prediction_date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_latest_predictions(UUID) TO authenticated;
