import { Component, effect, signal } from '@angular/core';
import { email, Field, form, max, min, minLength, required, schema } from '@angular/forms/signals';

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

const subscriptionSchema = schema<SubscribeFormModel>((rootPath) => {
  required(rootPath.email, {
    message: 'your email address is required to receive our newsletter.',
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
  imports: [Field],
  template: `
    <div class="card">
      <!-- <div class="card-header">
        {{ pageHeader() }}
      </div> -->
      <div class="card-body">
        <form>
          <div class="row">
            <label class="row-label" for="firstNameId"> First Name </label>
            <div class="row-value">
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

          <!-- <div class="row">
            <div class="row-value">
              <button
                type="button"
                title="Ensure the form is valid and required fields are entered before subscribing"
                class="btn btn-primary"
                (click)="subscribe()"
              >
                Subscribe
              </button>
              <button type="button" class="btn btn-secondary" (click)="cancel()">Cancel</button>
            </div>
          </div> -->
        </form>

        <!-- @if (subscribeMessage()) {
        <div class="alert alert-success">
          {{ subscribeMessage() }}
        </div>
        } -->
      </div>
    </div>
  `,
  styleUrls: ['./subscribe-form.css'],
})
export class SubscribeForm {
  readonly #subscribeModel = signal<SubscribeFormModel>(initialData);
  protected readonly subscribeForm = form(this.#subscribeModel, subscriptionSchema);

  eff = effect(() => {
    console.log('Subscribe Form Model Changed:', this.#subscribeModel());
  });
}
