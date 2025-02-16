import { api } from "./api";
import { fetcher } from "./services/api.service";

export async function getPages() {
  const response = await fetcher(`/pages`, {
    cacheConfig: {
      revalidate: 60 * 60 * 24, // 24 hours
    },
  });

  return response as {
    about_us: string;
    terms_and_conditions: string;
    privacy_policy: string;
    faq: string;
    contact_us: string;
    return_page: {
      content: string;
      status: string;
    };
    refund_page: {
      content: string;
      status: string;
    };
    cancellation_page: {
      content: string;
      status: string;
    };
  };
}

export async function subscribeNewsletter(email: string) {
  const response = await api.post(`/subscribe-newsletter`, {
    email,
  });
  return response.data;
}
