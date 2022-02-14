namespace TalentNamespace {
  export interface TalentMetadata {
    next: string | null;
    total: number;
  }
  export interface Talent {
    uuid: string;
    created_at: string;
    updated_at: string;
    deleted_at: null;
    first_name: string;
    last_name: string;
    preferred_name: string;
    pronoun: string;
    preferred_job_title: string;
    professional_start_date: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    edges: {
      portfoliolinks: {
        uuid: string;
        created_at: string;
        updated_at: string;
        deleted_at: null;
        url: string;
        name: string;
      }[];
      skills: {
        uuid: string;
        created_at: string;
        updated_at: string;
        name: string;
        years_of_experience: number;
        preferred: true;
        note: string;
      }[];
      work_experiences: {
        uuid: string;
        created_at: string;
        updated_at: string;
        deleted_at: null;
        company_name: string;
        location: string;
        job_title: string;
        description: string;
        start_date: string;
        end_date: string;
        primary_technologies: string[];
      }[];
      educations: {
        uuid: string;
        created_at: string;
        updated_at: string;
        deleted_at: null;
        institution_name: string;
        location: string;
        degree: string;
        program: string;
        overview: string;
        start_date: string;
        end_date: string;
      }[];
    };
  }
}
