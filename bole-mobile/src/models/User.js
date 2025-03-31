/**
 * User model class
 * Represents a user in the system (either JOBSEEKER or RECRUITER)
 */
export class User {
  constructor(data = {}) {
    this.userId = data.userId || null;
    this.username = data.username || '';
    this.email = data.email || '';
    this.role = data.role || 'JOBSEEKER'; // JOBSEEKER or RECRUITER
    this.profilePicture = data.profilePicture || null;
    this.token = data.token || null;
  }
}

/**
 * Resume model class
 * Represents a job seeker's resume
 */
export class Resume {
  constructor(data = {}) {
    this.resumeId = data.resumeId || null;
    this.fullName = data.fullName || '';
    this.phoneNumber = data.phoneNumber || '';
    this.address = data.address || '';
    this.education = data.education || [];
    this.experience = data.experience || [];
    this.skills = data.skills || [];
    this.userId = data.userId || null;
  }
}

/**
 * Company model class
 * Represents a recruiter's company
 */
export class Company {
  constructor(data = {}) {
    this.companyId = data.companyId || null;
    this.companyName = data.companyName || '';
    this.companyDescription = data.companyDescription || '';
    this.location = data.location || '';
    this.contactInfo = data.contactInfo || '';
    this.userId = data.userId || null;
  }
}