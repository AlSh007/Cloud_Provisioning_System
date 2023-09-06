# Design Plan: Cloud Environment Provisioning System on AWS EKS

## Introduction

This design plan outlines the development of the Cloud Environment Provisioning System designed to run on Amazon Web Services Elastic Kubernetes Service (AWS EKS). The core objective of the system is to streamline the efficient provisioning of cloud environments for developers, reducing operational challenges for DevOps teams, all while upholding robustness, security, and user-friendliness.

## System Overview

The Cloud Environment Provisioning System will consist of the following key components and steps:

### Step 1: API Endpoint Design

- **Objective:** Design user-friendly API endpoints for provisioning cloud environments.
- **Details:** API endpoints will be designed using industry-standard tools such as Swagger or Postman. These endpoints will allow users to specify their cloud environment provisioning requirements in a straightforward and intuitive manner.

### Step 2: Request Handling and Parsing

- **Objective:** Handle and parse incoming requests for provisioning.
- **Details:** Incoming provisioning requests will be processed using Node.js and Express.js, providing a reliable and efficient means of routing and handling HTTP requests. The Joi library will be used for request validation, ensuring data integrity.

### Step 3: Environment Provisioning Logic with eksctl on AWS EKS

- **Objective:**: Dynamically generate eksctl configurations and create EKS clusters on AWS EKS using eksctl.

- **Details:**

- **3.1. Dynamic eksctl Configuration Generation:**

Develop a component within our API that dynamically generates eksctl configurations based on user requests. This configuration will encapsulate all the necessary parameters for EKS cluster creation, We can utilize Node.js' Handlebars.js library to generate configuration yaml file.

- **3.2. Cluster Creation using eksctl**:

We will pass the dynamically generated eksctl configuration as an input to the eksctl create cluster command, ensuring that all the required cluster resources are provisioned.
We will also ensure that your API environment has the necessary permissions and IAM roles to execute eksctl commands securely.

- **3.3. Error Handling and Validation**:

We wiil also implement comprehensive error handling mechanisms within our API. Capture and handle errors that may occur during the eksctl cluster creation process.

-  **3.4. Monitoring and Status Tracking**:

We will continuously monitor the status of the EKS cluster provisioning process initiated by eksctl. We can capture the output and error streams of eksctl to track the progress.
Implement status updates and notifications to inform users of the provisioning progress and completion.

### Step 4: Approval Process

- **Objective:** Implement an approval mechanism for provisioning requests.
- **Details:** Kubernetes' Role-Based Access Control (RBAC) configurations will be utilized to control access to the EKS cluster, ensuring that only authorized users can initiate provisioning actions.

### Step 5: Notification

- **Objective:** Notify developers upon successful provisioning.
- **Details:** Amazon Simple Email Service (SES) will be employed to send email notifications to users upon successful environment provisioning. Additionally, Amazon Simple Notification Service (SNS) will be optional for broader notification options.

### Step 6: Quota Tracking

- **Objective:** Manage and track resource quotas.
- **Details:** Microservices developed using Node.js and Express.js will manage resource quotas, with data stored in Amazon Relational Database Service (RDS) for accurate tracking and reporting.

### Step 7: Environment Tracking

- **Objective:** Continuously monitor environment lifecycles.
- **Details:** Background jobs will be scheduled using Node.js's `cron` library or AWS Simple Queue Service (SQS) to monitor the lifecycle of environments, including temporary ones.

### Step 8: Resiliency

- **Objective:** Enhance system resiliency using the circuit-breaker pattern.
- **Details:** The circuit-breaker pattern will be implemented using libraries like `hystrix` for Node.js, ensuring that the system can gracefully handle failures without cascading effects.

### Step 9: Documentation and Testing

- **Objective:** Create comprehensive documentation and perform testing.
- **Details:** Extensive documentation will be produced using Markdown editors or Confluence, covering system setup, configuration, and usage. Rigorous testing will include unit and integration tests using Mocha and Chai for Node.js, along with API endpoint testing using Postman.

### Step 10: UI Development with React
- **Objective**: Develop a user interface using React to enhance the user experience.
- **Details**: A JavaScript-based user interface will be developed using React, providing an intuitive and interactive frontend for users to interact with the system.

### Step 11: Integration with AWS Services (Optional)

- **Objective:** Integrate with AWS services to enhance functionality.
- **Details:** Integration with AWS services will be optional and based on project requirements. AWS SDKs for Node.js will be utilized for programmatic integration, and AWS IAM will manage access control. AWS SNS will provide enhanced notification capabilities if chosen.

## Conclusion

This design plan outlines a comprehensive strategy for building a Cloud Environment Provisioning System on AWS EKS. It focuses on user-friendly API design, secure request handling, dynamic environment provisioning, robust approval processes, effective notifications, resource quota management, environment lifecycle tracking, and system resiliency. Optional integration with AWS services enhances system capabilities.

By following this plan, we aim to create a powerful and efficient system that streamlines cloud environment provisioning on AWS EKS, ensuring quick provisioning of cloud environment without much effort from DevOps Team. This design plan provides a clear roadmap for development, testing, and deployment, ensuring the successful implementation of the Cloud Environment Provisioning System.

**However if we decide to use Docker Desktop to host a Kubernetes Instance, these would be the steps and challenges**: 


1. **Infrastructure and Deployment Environment:**
   - We could set up a local Kubernetes cluster using Docker Desktop's built-in Kubernetes support for development and testing purposes.

2. **Networking and Access Control:**
   - We could configure networking and access control policies manually within the local Kubernetes cluster since we won't have AWS-managed networking.

3. **Resource Scaling:**
   - Our ability to scale resources might be limited by the capacity of our development machine when running on a local Kubernetes cluster.

4. **Resource Isolation:**
   - We should ensure resource isolation from the local development environment, as AWS EKS provides better isolation between the cloud environment and our local machine.

5. **Data Storage:**
   - For data storage, we could consider using local storage options or configuring persistent volumes differently compared to AWS-based solutions.

6. **Cost:**
   - Running a local Kubernetes cluster on Docker Desktop could result in lower operational costs compared to AWS EKS. However, we should factor in the cost of setting up and maintaining the local development environment.

7. **High Availability and Failover:**
   - We would need to manually configure and manage high availability and failover in our local Kubernetes cluster, unlike AWS EKS, which offers automatic failover.

8. **Integration with AWS Services:**
   - If our system relies on other AWS services for various functionalities, we could explore adapting or replacing those services to align with our local development environment.

9. **Deployment Strategy:**
   - We would rely on Kubernetes manifests and deployment tools like Helm for deploying applications to our local cluster, as opposed to AWS deployment tools.

10. **Backup and Disaster Recovery:**
    - We could design and implement custom backup and recovery solutions tailored to our local Kubernetes cluster instead of relying on AWS-specific solutions.

11. **Testing and Development Workflow:**
    - Our development and testing workflow would shift to a local development environment, potentially impacting collaboration and testing with team members.

12. **Security Considerations:**
    - We should consider security adjustments when transitioning from a cloud-based solution to a local environment, ensuring the security of our local Kubernetes cluster.

13. **Resource Constraints:**
    - Resource constraints on our local machine could affect our scalability and performance testing capabilities compared to AWS EKS, which can dynamically provision additional resources.

In summary, choosing to run the system on a Kubernetes instance on Docker Desktop offers cost savings and control over our development environment. However, it also presents trade-offs in terms of scalability, high availability, and integration with cloud services. The decision between local development and cloud deployment should align with our specific project requirements and constraints.
