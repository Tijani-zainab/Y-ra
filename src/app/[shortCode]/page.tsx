import { redirect } from 'next/navigation';
import { getShortUrlByCode, trackClick, detectDevice } from '../../utils/urlService';

export default async function RedirectPage({ params }: { params: { shortCode: string } }) {
  try {
    const { shortCode } = params;

    // Get the URL
    const urlData = await getShortUrlByCode(shortCode);

    if (!urlData) {
      redirect('/?error=url-not-found');
    }

    // Track the click (non-blocking)
    try {
      const userAgent = globalThis.navigator?.userAgent || '';
      const device = detectDevice(userAgent);
      await trackClick(shortCode, undefined, device);
    } catch (err) {
      console.error('Failed to track click:', err);
      // Continue even if tracking fails
    }

    // Redirect to the original URL
    redirect(urlData.originalUrl);
  } catch (err) {
    redirect('/?error=redirect-failed');
  }
}
