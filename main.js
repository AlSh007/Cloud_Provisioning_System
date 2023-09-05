const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken'); 
const AWS = require('./aws-config'); // Importing AWS configuration file
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

//to store users data, in production we will use a database
const users = [
    {
      id: 1,
      username: 'user1',
      password: 'password1',
    },
    {
      id: 2,
      username: 'user2',
      password: 'password2',
    },
  ];
  
  const environments = [];

  const quotas = {
    temporary: {
      available: 10,
      used: 0,
    },
    permanent: {
      available: 5,
      used: 0,
    },
  };

  // Secret key for JWT (replace with a strong secret in production)
  const JWT_SECRET = 'your_secret_key';
  
  // Authentication endpoint
  app.post('/auth/login', (req, res) => {
    // Parse request body
    const { username, password } = req.body;
  
    // Find the user in the mock user data
    const user = users.find((u) => u.username === username && u.password === password);
  
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  
    // Generate a JWT token for the authenticated user
    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
  
    res.json({ token });
  });


  function provisionEnvironment(environmentRequest) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate successful provisioning
        resolve({ status: 'provisioned', ...environmentRequest });
      }, 5000); // Simulating a 5-second provisioning process
    });
  }
  
  // Provisioning endpoint
  app.post('/environments/provision', async (req, res) => {
    // Parse request body
    const { environmentType, numberOfNodes, instanceType } = req.body;
  
    // Validate input parameters (e.g., check if numberOfNodes is a positive integer)
  
    // Create a new environment request object
    const environmentRequest = {
      environmentType,
      numberOfNodes,
      instanceType,
      status: 'provisioning',
      createdAt: new Date().toISOString(),
    };
  
    try {
      // Simulating provisioning 
      const provisionedEnvironment = await provisionEnvironment(environmentRequest);
  
      // Add the provisioned environment to the in-memory storage
      environments.push(provisionedEnvironment);
  
      res.status(201).json(provisionedEnvironment);
    } catch (error) {
      console.error('Provisioning error:', error);
      res.status(500).json({ error: 'Provisioning failed' });
    }
  });
  
  // Endpoint to get the current quotas
  app.get('/quota', (req, res) => {
    res.json(quotas);
  });
  
  // Endpoint to allocate and enforce quotas
  app.post('/quota/allocate', (req, res) => {
    const { environmentType, amount } = req.body;
  
    // Check if the environmentType is valid (temporary or permanent)
    if (!(environmentType in quotas)) {
      return res.status(400).json({ error: 'Invalid environmentType' });
    }
  
    // Check if the requested amount is a positive integer
    if (isNaN(amount) || amount <= 0 || Math.floor(amount) !== amount) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
  
    // Check if enough quota is available
    if (quotas[environmentType].used + amount > quotas[environmentType].available) {
      return res.status(400).json({ error: 'Insufficient quota' });
    }
  
    // Update quotas based on the allocation request
    quotas[environmentType].used += amount;
  
    res.json(quotas);
  });


  // Import necessary modules and set up your Express app as before

  const temporaryEnvironmentExpiryTime = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds

  // Function to check and send notifications for expiring environments
  function checkAndNotifyExpiringEnvironments() {
    const currentTime = Date.now();
  
    environments.forEach((env) => {
      if (env.status === 'approved' && env.environmentType === 'temporary') {
        const timeRemaining = env.expirationTime - currentTime;
  
        if (timeRemaining <= temporaryEnvironmentExpiryTime) {
          // Send a notification to the developer that the environment is about to expire
          console.log(`Sending notification to ${env.developerId}: Your temporary environment is about to expire.`);
        }
      }
    });
  }
  
  setInterval(checkAndNotifyExpiringEnvironments, 60 * 60 * 1000); // Check every hour
  
  // Endpoint to request a new environment
  app.post('/environment/request', (req, res) => {
    const { environmentType, expirationTime, developerId } = req.body;
  
    // Create a new environment request object
    const environmentRequest = {
      environmentType,
      expirationTime,
      developerId,
      status: 'pending', // Initial status is pending
    };
  
    // Add the environment request to the list of environments
    environments.push(environmentRequest);
  
    res.json({ message: 'Environment request received and pending approval' });
  });
  
  // Endpoint to list all environments
  app.get('/environments', (req, res) => {
    res.json(environments);
  });
  
  // Endpoint to extend an environment's expiration time (requires DevOps approval)
  app.post('/environment/extend/:environmentId', (req, res) => {
    const { environmentId } = req.params;
    const { extensionTime } = req.body;
  
    const environment = environments.find((env) => env.id === environmentId);
  
    if (!environment) {
      return res.status(404).json({ error: 'Environment not found' });
    }
  
    if (environment.status !== 'approved') {
      return res.status(400).json({ error: 'Environment is not approved for extension' });
    }
  
    // Check if the extensionTime is valid (e.g., within certain limits)
    // Perform DevOps approval logic here (not shown in this code)
  
    environment.expirationTime += extensionTime;
  
    res.json({ message: 'Environment extension request received and approved' });
  });
  
  // Endpoint to purge expired environments and update quotas
  app.post('/environments/purge', (req, res) => {
    const currentTime = Date.now();
  
    // Filter and remove expired environments
    environments.filter((env, index) => {
      if (env.expirationTime <= currentTime) {
        // Purge the environment
        // Update the quota here based on environment type and duration
        if (env.environmentType === 'temporary') {
          // Update the temporary quota
          // Example: quotas.temporary.used -= 1;
        } else if (env.environmentType === 'permanent') {
          // Update the permanent quota
          // Example: quotas.permanent.used -= 1;
        }
  
        // Remove the environment from the list
        environments.splice(index, 1);
        return false;
      }
      return true;
    });
  
    res.json({ message: 'Expired environments purged' });
  });
  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
