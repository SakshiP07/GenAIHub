const topicResponses = [
  {
    keywords: ["devops", "dev ops"],
    response:
      "DevOps is a software engineering practice that combines Development and Operations. " +
      "It focuses on automation, continuous integration, continuous delivery (CI/CD), " +
      "collaboration, monitoring, and faster, reliable software releases.",
  },
  {
    keywords: ["kubernetes", "kuberentes", "kubernetees", "k8s", "kuber"],
    response:
      "Kubernetes is a container orchestration platform used to deploy, scale, and manage " +
      "containerized applications automatically across clusters. It handles scheduling, " +
      "load balancing, self-healing, and rolling updates.",
  },
  {
    keywords: ["docker", "container"],
    response:
      "Docker is a platform for building, shipping, and running applications inside containers, " +
      "making deployments consistent across development, testing, and production environments.",
  },
  {
    keywords: ["jenkins", "ci/cd", "cicd", "pipeline"],
    response:
      "Jenkins is a CI/CD automation tool used to build, test, and deploy software. " +
      "Pipelines automate repetitive tasks and improve delivery speed and reliability.",
  },
  {
    keywords: ["terraform", "infrastructure as code", "iac"],
    response:
      "Terraform is an Infrastructure as Code (IaC) tool that provisions cloud resources " +
      "using declarative configuration files, enabling consistent and repeatable infrastructure deployment.",
  },
  {
    keywords: ["prometheus", "grafana", "monitoring"],
    response:
      "Prometheus collects system and application metrics, while Grafana visualizes them on dashboards. " +
      "Together they help teams monitor CPU, memory, container health, and service performance.",
  },
  {
    keywords: ["genai", "ai", "inference", "llm"],
    response:
      "GenAIHub is an AI operations platform that provides model management, inference APIs, " +
      "monitoring, and DevOps tooling for deploying and running AI workloads in production.",
  },
];

function buildSimulatedResponse(prompt) {
  const normalized = prompt.trim().toLowerCase();

  for (const topic of topicResponses) {
    if (topic.keywords.some((keyword) => normalized.includes(keyword))) {
      return topic.response;
    }
  }

  return (
    `I could not find a specific topic match for "${prompt.trim()}". ` +
    "GenAIHub demo backend supports prompts about DevOps, Kubernetes, Docker, Jenkins, " +
    "Terraform, Prometheus, Grafana, and AI inference."
  );
}

function generateResponse(req, res, next) {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      const error = new Error("Prompt is required and must be a non-empty string");
      error.statusCode = 400;
      throw error;
    }

    res.json({
      response: buildSimulatedResponse(prompt),
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { generateResponse };
