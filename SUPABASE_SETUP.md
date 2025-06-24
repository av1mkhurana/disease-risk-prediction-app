# Supabase Integration Setup Guide

This guide will help you set up Supabase as the backend for the Disease Risk Prediction App, replacing the local PostgreSQL database with Supabase's managed database and authentication system.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js and npm installed
- Python 3.8+ installed

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Fill in project details:
   - **Name**: `disease-risk-prediction`
   - **Database Password**: Choose a strong password
   - **Region**: Select the region closest to your users
5. Click "Create new project"
6. Wait for the project to be created (this may take a few minutes)

## Step 2: Configure Database Schema

1. In your Supabase dashboard, go to the **SQL Editor**
2. Copy the contents of `supabase-schema.sql` from this project
3. Paste it into the SQL Editor
4. Click "Run" to execute the schema
5. Verify that the tables were created by checking the **Table Editor**

You should see these tables:
- `user_profiles`
- `lab_results` 
- `risk_predictions`

## Step 3: Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project-id.supabase.co`)
   - **Project API Key** (anon public key)
   - **Service Role Key** (keep this secret!)

## Step 4: Configure Backend Environment

1. Navigate to the backend directory:
   ```bash
   cd disease-risk-app/backend
   ```

2. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

3. Edit the `.env` file and update the Supabase configuration:
   ```env
   # Supabase Configuration
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_KEY=your-supabase-service-role-key
   
   # Keep other settings as needed
   SECRET_KEY=your-secret-key-change-in-production
   ENCRYPTION_KEY=your-encryption-key-32-bytes-long
   ```

4. Install the updated Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Step 5: Configure Frontend Environment

1. Navigate to the frontend directory:
   ```bash
   cd disease-risk-app/frontend
   ```

2. Create a `.env` file:
   ```bash
   touch .env
   ```

3. Add your Supabase configuration to `.env`:
   ```env
   REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Install the updated Node.js dependencies:
   ```bash
   npm install
   ```

## Step 6: Configure Authentication

### Email Templates (Optional)

1. In Supabase dashboard, go to **Authentication** → **Templates**
2. Customize the email templates for:
   - Confirm signup
   - Reset password
   - Magic link

### Authentication Settings

1. Go to **Authentication** → **Settings**
2. Configure the following:
   - **Site URL**: `http://localhost:3000` (for development)
   - **Redirect URLs**: Add your production URLs when deploying
   - Enable/disable providers as needed

## Step 7: Set Up Row Level Security (RLS)

The schema file already includes RLS policies, but verify they're working:

1. Go to **Authentication** → **Policies**
2. Check that policies exist for all tables:
   - `user_profiles`: 4 policies (SELECT, INSERT, UPDATE, DELETE)
   - `lab_results`: 4 policies (SELECT, INSERT, UPDATE, DELETE)
   - `risk_predictions`: 4 policies (SELECT, INSERT, UPDATE, DELETE)

## Step 8: Test the Integration

### Start the Backend

```bash
cd disease-risk-app/backend
uvicorn app.main:app --reload
```

The API should start on `http://localhost:8000`

### Start the Frontend

```bash
cd disease-risk-app/frontend
npm start
```

The frontend should start on `http://localhost:3000`

### Test Authentication

1. Go to `http://localhost:3000`
2. Try to register a new account
3. Check your email for confirmation
4. Try logging in
5. Verify that user data is being stored in Supabase

## Step 9: Verify Database Operations

### Check User Registration

1. Register a new user through the frontend
2. In Supabase dashboard, go to **Authentication** → **Users**
3. Verify the new user appears
4. Go to **Table Editor** → **user_profiles**
5. Verify a profile was automatically created

### Test Data Storage

1. Complete the user profile through the frontend
2. Add some lab results
3. Generate risk predictions
4. Verify all data appears in the respective Supabase tables

## Step 10: Production Deployment

### Environment Variables for Production

Update your production environment with:

```env
# Backend (.env)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-supabase-anon-key
SUPABASE_SERVICE_KEY=your-supabase-service-role-key
SECRET_KEY=your-production-secret-key
ENCRYPTION_KEY=your-production-encryption-key
ENVIRONMENT=production
DEBUG=false

# Frontend (.env.production)
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Update Supabase Settings

1. In **Authentication** → **Settings**:
   - Update **Site URL** to your production domain
   - Add production URLs to **Redirect URLs**

2. In **Settings** → **API**:
   - Consider regenerating keys for production
   - Set up proper CORS policies

## Troubleshooting

### Common Issues

1. **"Invalid JWT" errors**:
   - Check that SUPABASE_URL and SUPABASE_KEY are correct
   - Verify the user is properly authenticated

2. **RLS policy errors**:
   - Ensure RLS policies are properly set up
   - Check that `auth.uid()` matches the user_id in queries

3. **CORS errors**:
   - Verify CORS settings in Supabase
   - Check that frontend URL is in allowed origins

4. **Database connection errors**:
   - Verify Supabase project is active
   - Check network connectivity
   - Ensure credentials are correct

### Useful Supabase Features

1. **Real-time subscriptions**: Enable real-time updates for tables
2. **Storage**: Add file upload capabilities for lab results
3. **Edge Functions**: Deploy serverless functions for complex ML operations
4. **Webhooks**: Set up notifications for important events

## Security Considerations

1. **Never expose service role key** in frontend code
2. **Use RLS policies** to protect user data
3. **Encrypt sensitive health data** at the application level
4. **Regularly rotate API keys** in production
5. **Monitor authentication logs** for suspicious activity

## Next Steps

1. Set up monitoring and logging
2. Configure backup strategies
3. Implement data export functionality
4. Set up staging environment
5. Plan for scaling and performance optimization

For more information, refer to the [Supabase Documentation](https://supabase.com/docs).
