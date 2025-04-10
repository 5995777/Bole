/**
 * User model class
 * Represents a user in the system (either JOBSEEKER or RECRUITER)
 */
export class User {
  constructor(data = {}) {
    this.userId = data.userId || null;
    this.username = data.username || "";
    this.email = data.email || "";
    this.role = data.role || "JOBSEEKER"; // JOBSEEKER or RECRUITER
    this.profilePicture = data.profilePicture || null;
    this.token = data.token || null;
    // User's unique identifier
    // User's username
    // User's email address
    // User's role (JOBSEEKER or RECRUITER)
    // URL of the user's profile picture
    // Authentication token for the user
  }
}

/**
 * Resume model class
 * Represents a job seeker's resume
 */
export class Resume {
  constructor(data = {}) {
    this.resumeId = data.resumeId || null;
    this.fullName = data.fullName || "";
    this.jobTitle = data.jobTitle || "";
    this.phoneNumber = data.phoneNumber || "";
    this.city = data.city || "";
    this.country = data.country || "";
    this.postalCode = data.postalCode || "";
    this.address = data.address || "";
    this.summary = data.summary || "";
    this.education = data.education || []; // Array of education entries
    this.experience = data.experience || []; // Array of experience entries
    this.skills = data.skills || []; // Array of skills
    this.website = data.website || ""; // Personal website or portfolio link
    this.socialMedia = data.socialMedia || []; // Array of social media links (e.g., LinkedIn, GitHub)
    this.languages = data.languages || []; // Array of spoken languages
    this.userId = data.userId || null;
    // Resume's unique identifier
    // Full name of the job seeker
    // Current or desired job title
    // Contact phone number
    // City of residence
    // Country of residence
    // Postal code
    // Full address
    // Brief summary or objective statement
    // Array of education entries
    // Array of work experience entries
    // Array of skills
  }
}

/**
 * Company model class
 * Represents a recruiter's company
 */
export class Company {
  constructor(data = {}) {
    this.companyId = data.companyId || null;
    this.companyName = data.companyName || "";
    this.companyDescription = data.companyDescription || "";
    this.industry = data.industry || "";
    this.numberOfEmployees = data.numberOfEmployees || 0;
    this.foundedYear = data.foundedYear || null;
    this.city = data.city || "";
    this.country = data.country || "";
    this.postalCode = data.postalCode || "";
    this.location = data.location || "";
    this.contactInfo = data.contactInfo || "";
    this.website = data.website || "";
    this.logo = data.logo || null;
    this.socialMedia = data.socialMedia || []; // Array of social media links
    this.userId = data.userId || null;
    // Company's unique identifier
    // Name of the company
    // Description of the company
  }
}