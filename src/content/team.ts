/**
 * SAMPLE team members (shown when features.showTeam = true, labelled "Sample").
 * Replace names, roles, bios, photos and LinkedIn URLs; then set isSample: false.
 */
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  /** e.g. "/images/team/jane.jpg" — empty shows an initials avatar */
  photo: string;
  linkedin: string;
  isSample: boolean;
}

export const team: TeamMember[] = [
  {
    id: 'm1',
    name: 'Firstname Lastname', // PLACEHOLDER
    role: 'Lead Admission Counsellor',
    bio: 'Guides UG and PG applicants through shortlisting, applications and interviews, with a focus on balanced, realistic choices.',
    photo: '',
    linkedin: '',
    isSample: true, // PLACEHOLDER
  },
  {
    id: 'm2',
    name: 'Firstname Lastname', // PLACEHOLDER
    role: 'Career Counsellor',
    bio: 'Runs aptitude assessments and career-mapping sessions for school students, graduates and early-career professionals.',
    photo: '',
    linkedin: '',
    isSample: true, // PLACEHOLDER
  },
  {
    id: 'm3',
    name: 'Firstname Lastname', // PLACEHOLDER
    role: 'Research Methodology Mentor',
    bio: 'Supports PhD scholars with research design and statistical analysis in SPSS, R and Python.',
    photo: '',
    linkedin: '',
    isSample: true, // PLACEHOLDER
  },
  {
    id: 'm4',
    name: 'Firstname Lastname', // PLACEHOLDER
    role: 'Senior Academic Editor',
    bio: 'Edits and formats manuscripts for reputable journals and leads our journal-screening and publication-ethics checks.',
    photo: '',
    linkedin: '',
    isSample: true, // PLACEHOLDER
  },
];
