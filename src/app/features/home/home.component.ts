import { Component, inject, OnInit } from '@angular/core';
import { HeroComponent } from './hero/hero.component';
import { FeaturesComponent } from './features/features.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { FaqComponent } from './faq/faq.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SeoService } from '../../core/services/seo.service';
import { FreePlanComponent } from './free-plan/free-plan.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroComponent,
    FeaturesComponent,
    TestimonialsComponent,
    FaqComponent,
    FooterComponent,
    FreePlanComponent,
  ],
  template: `
    <app-navbar />

    <main>
      <app-hero />
      <app-free-plan />
      <app-features />
      <app-testimonials />
      <app-faq />
    </main>

    <app-footer />
  `,
})
export class HomeComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.updateMeta({
      title: 'CineCrew',
      description:
        'Organize suas idas ao cinema com seus amigos. Centralize pagamentos, fotos e memórias em um só lugar.',
    });
  }
}
