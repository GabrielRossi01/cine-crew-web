import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoConfig {
  title: string;
  description: string;
  url?: string;
  image?: string;
  noIndex?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  updateMeta(config: SeoConfig): void {
    const pageTitle = config.title.trim();

    this.title.setTitle(pageTitle);

    this.meta.updateTag({
      name: 'description',
      content: config.description,
    });

    this.meta.updateTag({
      property: 'og:title',
      content: pageTitle,
    });

    this.meta.updateTag({
      property: 'og:description',
      content: config.description,
    });

    this.meta.updateTag({
      property: 'og:type',
      content: 'website',
    });

    if (config.url) {
      this.meta.updateTag({
        property: 'og:url',
        content: config.url,
      });
    }

    if (config.image) {
      this.meta.updateTag({
        property: 'og:image',
        content: config.image,
      });
    }

    this.meta.updateTag({
      name: 'twitter:card',
      content: 'summary_large_image',
    });

    this.meta.updateTag({
      name: 'twitter:title',
      content: pageTitle,
    });

    this.meta.updateTag({
      name: 'twitter:description',
      content: config.description,
    });

    if (config.image) {
      this.meta.updateTag({
        name: 'twitter:image',
        content: config.image,
      });
    }

    this.meta.updateTag({
      name: 'robots',
      content: config.noIndex ? 'noindex, nofollow' : 'index, follow',
    });
  }
}
