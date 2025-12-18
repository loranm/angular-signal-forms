import { Component, computed, effect, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  email,
  Field,
  FieldState,
  form,
  max,
  min,
  minLength,
  required,
  schema,
} from '@angular/forms/signals';

type SubscribeFormModel = {
  firstName: string;
  lastName: string;
  email: string;
  yearsAsFan: number;
};

const initialData: SubscribeFormModel = {
  firstName: '',
  lastName: '',
  email: '',
  yearsAsFan: NaN,
};

// Declaration des règles de validation.
const subscriptionSchema = schema<SubscribeFormModel>((rootPath) => {
  required(rootPath.email, {
    message: 'your email address is required to receive our newsletter.', // ici on déclare le message d'erreur personnalisé pour le champ email et l'erreur required
  });
  email(rootPath.email, {
    message: 'please enter a valid email address.',
  });
  minLength(rootPath.email, 6, {
    message: 'email address must be at least 5 characters long.',
  });
  min(rootPath.yearsAsFan, 0, {
    message: 'years as a fan cannot be negative.',
  });
  max(rootPath.yearsAsFan, 100, {
    message: 'please enter a realistic number of years as a fan.',
  });
});

@Component({
  imports: [Field, ReactiveFormsModule],
  template: `
    <div class="card">
      <div class="card-header">
        @let headerText = "Subscribe to our Newsletter " + fullName() ;
        <h2>{{ headerText }}</h2>
      </div>
      <div class="card-body">
        <form>
          <div class="row">
            <label class="row-label" for="firstNameId"> First Name </label>
            <div class="row-value">
              <!-- [field] => Liaison du champ de formulaire au modèle. -->
              <input
                type="text"
                class="form-control"
                [field]="subscribeForm.firstName"
                id="firstNameId"
                placeholder="First Name (optional)"
              />
            </div>
          </div>

          <div class="row">
            <label class="row-label" for="lastNameId"> Last Name </label>
            <div class="row-value">
              <input
                type="text"
                class="form-control"
                [field]="subscribeForm.lastName"
                id="lastNameId"
                placeholder="Last Name (optional)"
              />
            </div>
          </div>

          <div class="row">
            <label class="row-label" for="emailId">
              Email <span class="text-danger">*</span>
            </label>
            <div class="row-value">
              <input
                type="email"
                class="form-control"
                [field]="subscribeForm.email"
                id="emailId"
                placeholder="Email (required)"
              />
            </div>
            <!-- Affichage des messages d'erreur de validation pour le champ email. -->
            @if (subscribeForm.email().invalid() && subscribeForm.email().touched()) {
            <div class="alert alert-danger">
              @for (error of subscribeForm.email().errors(); track error.kind) {
              <div>{{ error.message }}</div>
              }
            </div>
            }
          </div>

          <div class="row">
            <label class="row-label" for="yearsAsFanId"> Years as a Fan </label>
            <div class="row-value">
              <input
                type="number"
                class="form-control"
                [field]="subscribeForm.yearsAsFan"
                id="yearsAsFanId"
                placeholder="How many years have you been a Star Wars fan?"
              />
            </div>
            @if (subscribeForm.yearsAsFan().invalid() && subscribeForm.yearsAsFan().touched()) {
            <div class="alert alert-danger">
              @for (error of subscribeForm.yearsAsFan().errors(); track error.kind) {
              <div>{{ error.message }}</div>
              }
            </div>
            }
          </div>

          <div class="row">
            <div class="row-value">
              <button
                type="button"
                title="Ensure the form is valid and required fields are entered before subscribing"
                class="btn btn-primary"
                (click)="submit(subscribeForm())"
              >
                Subscribe
              </button>
              <button type="button" class="btn btn-secondary" (click)="cancel()">Cancel</button>
            </div>
          </div>
        </form>

        @if (subscribeMessage()) {
        <div class="alert alert-success">
          {{ subscribeMessage() }}
        </div>
        }
      </div>
    </div>
  `,
  styleUrls: ['./subscribe-form.css'],
})
export class SubscribeForm {
  readonly #subscribeModel = signal<SubscribeFormModel>(initialData); // Le modèle de données du formulaire en tant que signal.
  protected readonly subscribeForm = form(this.#subscribeModel, subscriptionSchema); // Le formulaire avec le modèle et le schéma de validation.

  protected fullName = computed(() => {
    const { firstName, lastName } = this.#subscribeModel();
    return `${firstName} ${lastName}`.trim();
  });

  protected subscribeMessage = signal<string | null>(null);

  eff = effect(() => {
    console.log('Subscribe Form Model Changed:');
  });

  protected cancel = (): void => this.subscribeForm().reset(initialData);

  protected submit(form: FieldState<SubscribeFormModel>): void {
    if (form.invalid()) {
      form.markAsTouched();
    }
    this.subscribeMessage.set(`Thank you for subscribing, ${this.fullName() || 'Valued Fan'}!`);

    this.subscribeForm().reset(initialData);
  }
}
