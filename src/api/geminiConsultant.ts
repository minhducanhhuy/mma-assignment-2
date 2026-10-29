import { ProductEntity } from '../models/catalog';

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
const GEMINI_API_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export const GeminiConsultant = {
  /**
   * Check if Gemini API is available
   */
  hasApiKey(): boolean {
    return Boolean(API_KEY && API_KEY.trim().length > 0);
  },

  /**
   * Ask product advice or query
   */
  async consultAboutProduct(product: ProductEntity, userQuestion: string): Promise<string> {
    if (!this.hasApiKey()) {
      return 'Chưa cấu hình API Key cho Gemini (EXPO_PUBLIC_GEMINI_API_KEY). Bạn có thể thêm key trong cấu hình Snack hoặc file .env.';
    }

    const systemPrompt = `Bạn là DucShop AI Assistant - Chuyên gia tư vấn mua sắm thông minh của DucShop.
Sản phẩm đang xem:
- Tên: ${product.title}
- Thương hiệu: ${product.brand || 'N/A'}
- Phân loại: ${product.category}
- Giá: $${product.price} (Giảm ${product.discountPercentage}%)
- Đánh giá: ${product.rating}/5.0 (${product.reviews?.length || 0} lượt review)
- Tồn kho: ${product.stock} đơn vị
- Chính sách: ${product.warrantyInformation || 'N/A'} | ${product.shippingInformation || 'N/A'}
- Mô tả: ${product.description}

Hãy trả lời ngắn gọn, thân thiện, súc tích (khoảng 3-4 câu) bằng tiếng Việt để giúp khách hàng đưa ra quyết định mua hàng tốt nhất.`;

    try {
      const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                { text: systemPrompt },
                { text: `Khách hàng hỏi: "${userQuestion}"` },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 350,
          },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        return `Không thể kết nối đến Gemini AI (${response.status}): ${errText.slice(0, 100)}`;
      }

      const data = await response.json();
      const generatedText =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        'Xin lỗi, hiện tại trợ lý chưa có câu trả lời phù hợp.';
      return generatedText.trim();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return `Lỗi khi gọi Gemini: ${message}`;
    }
  },

  /**
   * Summarize user reviews into pros & cons
   */
  async analyzeFeedback(product: ProductEntity): Promise<string> {
    const feedbackList = (product.reviews || [])
      .map((r) => `- [${r.rating}*] ${r.comment} (${r.reviewerName})`)
      .join('\n');

    const question = `Hãy tổng hợp ngắn gọn ưu điểm và nhược điểm của sản phẩm "${product.title}" dựa trên các đánh giá của người mua sau đây:\n${feedbackList || 'Chưa có nhiều đánh giá chi tiết.'}`;
    return this.consultAboutProduct(product, question);
  },
};

