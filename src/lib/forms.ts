// Field definitions for every form that posts to /api/contact. The LeadForm
// component renders from these and the endpoint validates against them, so a
// field added here is both shown and accepted.

export type FieldKind = 'text' | 'email' | 'website' | 'select' | 'textarea';

export type FormField = {
  name: string;
  label: string;
  kind: FieldKind;
  required: boolean;
  options?: string[];
  autocomplete?: string;
  help?: string;
  /** Span both columns of the form grid. */
  full?: boolean;
};

export type FormType = 'contact' | 'scorecard' | 'waitlist';

export type FormDefinition = {
  /** Shown at the start of the notification email subject. */
  subjectLabel: string;
  /** Field whose value goes in the email subject after the label. */
  subjectField?: string;
  /** Where a no-JS submission is sent back to on error. */
  returnPath: string;
  fields: FormField[];
};

const NAME: FormField = { name: 'name', label: 'Name', kind: 'text', required: true, autocomplete: 'name' };
const EMAIL: FormField = { name: 'email', label: 'Email', kind: 'email', required: true, autocomplete: 'email' };
const WEBSITE: FormField = {
  name: 'website',
  label: 'Website URL',
  kind: 'website',
  required: true,
  autocomplete: 'url',
  full: true,
};

export const FORMS: Record<FormType, FormDefinition> = {
  contact: {
    subjectLabel: 'Contact',
    subjectField: 'interest',
    returnPath: '/contact',
    fields: [
      NAME,
      EMAIL,
      {
        name: 'interest',
        label: 'What are you interested in?',
        kind: 'select',
        required: true,
        options: ['Freelance Work (Waitlist)', 'Project Consultation', 'Something Else'],
        full: true,
      },
      {
        name: 'message',
        label: 'Message',
        kind: 'textarea',
        required: true,
        help: 'A sentence or two about your goal is plenty.',
        full: true,
      },
    ],
  },
  scorecard: {
    subjectLabel: 'Scorecard request',
    subjectField: 'website',
    returnPath: '/scorecard',
    fields: [
      NAME,
      EMAIL,
      WEBSITE,
      {
        name: 'message',
        label: 'What would you most like to know about your site?',
        kind: 'textarea',
        required: false,
        full: true,
      },
    ],
  },
  waitlist: {
    subjectLabel: 'Waiting list',
    subjectField: 'stage',
    returnPath: '/work-with-us',
    fields: [
      NAME,
      EMAIL,
      WEBSITE,
      {
        name: 'stage',
        label: 'What are you interested in?',
        kind: 'select',
        required: true,
        options: ['Foundation', 'Content', 'Optimize', 'Enable', 'Freelance analytics', 'Not sure'],
        full: true,
      },
      {
        name: 'message',
        label: 'Anything we should know?',
        kind: 'textarea',
        required: false,
        full: true,
      },
    ],
  },
};

export const isFormType = (value: string): value is FormType => value in FORMS;
