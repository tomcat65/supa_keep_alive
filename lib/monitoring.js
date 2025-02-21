import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const projects = [
  {
    name: process.env.PROJECT1_NAME,
    client: createClient(
      process.env.PROJECT1_URL,
      process.env.PROJECT1_ANON_KEY
    )
  },
  {
    name: process.env.PROJECT2_NAME,
    client: createClient(
      process.env.PROJECT2_URL,
      process.env.PROJECT2_ANON_KEY
    )
  }
]

async function performHealthCheck(project) {
  // ...existing code from index.js...
  const timestamp = new Date().toISOString();
  console.log(`Running health check for ${project.name} at ${timestamp}`);

  try {
    // Simple query to keep connection alive
    const { data, error } = await project.client
      .from('health_checks')
      .insert([{ 
        status: 'ok',
        project_name: project.name 
      }])
      .select();

    if (error) throw error;

    console.log(`Health check successful for ${project.name}:`, {
      timestamp,
      status: 'healthy',
      data
    });

    return {
      success: true,
      project: project.name,
      timestamp
    };
  } catch (error) {
    console.error(`Health check failed for ${project.name}:`, {
      timestamp,
      status: 'unhealthy',
      error: error.message
    });

    return {
      success: false,
      project: project.name,
      timestamp,
      error: error.message
    };
  }
}

export async function checkAllProjects() {
  // ...existing code from index.js...
  console.log('Starting health checks for all projects...');
  
  const results = await Promise.all(
    projects.map(project => performHealthCheck(project))
  );

  const summary = {
    timestamp: new Date().toISOString(),
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    details: results
  };

  console.log('Health check summary:', summary);
  return summary;
}
