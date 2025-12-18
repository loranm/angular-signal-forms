import { Component, effect, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import { initialData, Subscription, subscriptionSchema } from '../subscription';

@Component({
  templateUrl: './subscribe-form.html',
  styleUrl: './subscribe-form.css',
})
export class SubscribeForm {
  // Create a form model signal with form fields
  // This represents the form's data structure
  subscribeModel = signal<Subscription>(initialData);

  // Declare a form from the model and logic rules schema
  subscribeForm = form(this.subscribeModel, subscriptionSchema);

  eff = effect(() => console.log('Email:', this.subscribeModel().email));
}
