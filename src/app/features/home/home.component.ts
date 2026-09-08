import { Component, inject, OnInit } from '@angular/core';
import { HeroComponent } from './hero/hero.component';
import { FeaturesComponent } from './features/features.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, HeroComponent, FeaturesComponent, TestimonialsComponent, FooterComponent],
  template: `
    <app-navbar />
    <main>
      <app-hero />
      <app-features />
      <app-testimonials />
    </main>
    <app-footer />
  `
})
export class HomeComponent implements OnInit {
  private seo = inject(SeoService);
  ngOnInit() {
    this.seo.updateMeta({
      title: 'CineCrew',
      description: 'Organize suas idas ao cinema com seus amigos. Centralize pagamentos, fotos e memórias em um só lugar.'
    });
  }
}
