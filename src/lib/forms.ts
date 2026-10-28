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
  /**
   * Only applies when another field has a given value. The field is hidden
   * otherwise (with JS), required only when it applies, and dropped from the
   * email when it does not.
   */
  showWhen?: { field: string; value: string };
  /** Prefill from a query param, mapping param values to option labels. */
  param?: { name: string; values: Record<string, string> };
};

export type FormType = 'contact';

export type FormDefinition = {
  /** Shown at the start of the notification email subject. */
  subjectLabel: string;
  /** Field whose value goes in the email subject after the label. */
  subjectField?: string;
  /** Where a no-JS submission is sent back to on error. */
  returnPath: string;
  fields: FormField[];
};

export const REQUEST_DIAGNOSTIC = 'Diagnostic';
export const REQUEST_CUSTOM = 'Custom project';
export const REQUEST_FREELANCE = 'Freelance';

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
    subjectLabel: 'Discovery call',
    subjectField: 'request',
    returnPath: '/contact',
    fields: [
      NAME,
      EMAIL,
      WEBSITE,
      {
        name: 'request',
        label: 'What are you looking for?',
        kind: 'select',
        required: true,
        options: [REQUEST_DIAGNOSTIC, REQUEST_CUSTOM, REQUEST_FREELANCE],
        param: {
          name: 'type',
          values: {
            diagnostic: REQUEST_DIAGNOSTIC,
            custom: REQUEST_CUSTOM,
            freelance: REQUEST_FREELANCE,
          },
        },
        full: true,
      },
      {
        name: 'area',
        label: 'Area',
        kind: 'select',
        required: true,
        options: ['Web Analytics', 'Web Strategy', 'AI Strategy', 'Not sure'],
        showWhen: { field: 'request', value: REQUEST_DIAGNOSTIC },
        param: {
          name: 'area',
          values: {
            'web-analytics': 'Web Analytics',
            'web-strategy': 'Web Strategy',
            'ai-strategy': 'AI Strategy',
          },
        },
        full: true,
      },
      {
        name: 'message',
        label: 'Anything you want us to know?',
        kind: 'textarea',
        required: false,
        full: true,
      },
    ],
  },
};

export const isFormType = (value: string): value is FormType => value in FORMS;
