import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProductEntity } from '../../models/catalog';
import { GeminiConsultant } from '../../api/geminiConsultant';
import { Palette } from '../../core/constants/themeColors';

interface AiAdvisorModalProps {
  visible: boolean;
  onClose: () => void;
  product: ProductEntity;
}

export const AiAdvisorModal: React.FC<AiAdvisorModalProps> = ({
  visible,
  onClose,
  product,
}) => {
  const [question, setQuestion] = useState('');
  const [reply, setReply] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  const handleSendPrompt = async (promptText?: string) => {
    const textToQuery = promptText || question;
    if (!textToQuery.trim()) return;

    setIsThinking(true);
    setReply(null);
    try {
      const response = await GeminiConsultant.consultAboutProduct(product, textToQuery);
      setReply(response);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setReply(`Đã xảy ra sự cố: ${msg}`);
    } finally {
      setIsThinking(false);
    }
  };

  const handleQuickSummary = async () => {
    setIsThinking(true);
    setReply(null);
    try {
      const response = await GeminiConsultant.analyzeFeedback(product);
      setReply(response);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setReply(`Đã xảy ra sự cố: ${msg}`);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.backdrop}
      >
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.aiBadge}>
                <Ionicons name="sparkles" size={16} color={Palette.accent} />
              </View>
              <Text style={styles.headerTitle}>DucShop AI Advisor</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={Palette.textSub} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
            {/* Context Product Card */}
            <View style={styles.productBanner}>
              <Text style={styles.productBannerTitle} numberOfLines={1}>
                {product.title}
              </Text>
              <Text style={styles.productBannerSub}>
                ${product.price} • {product.category} • Rating: {product.rating}★
              </Text>
            </View>

            {/* Quick Action Chips */}
            <Text style={styles.sectionHeader}>Gợi ý câu hỏi nhanh:</Text>
            <View style={styles.chipRow}>
              <TouchableOpacity
                style={styles.quickChip}
                onPress={() => handleSendPrompt('Sản phẩm này có đáng mua không?')}
                disabled={isThinking}
              >
                <Text style={styles.quickChipText}>💡 Đáng mua không?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickChip}
                onPress={handleQuickSummary}
                disabled={isThinking}
              >
                <Text style={styles.quickChipText}>⭐ Tóm tắt đánh giá</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickChip}
                onPress={() => handleSendPrompt('Sản phẩm này phù hợp cho ai nhất?')}
                disabled={isThinking}
              >
                <Text style={styles.quickChipText}>🎯 Dành cho ai?</Text>
              </TouchableOpacity>
            </View>

            {/* Response area */}
            {isThinking && (
              <View style={styles.loaderBox}>
                <ActivityIndicator size="small" color={Palette.primary} />
                <Text style={styles.loaderText}>Trợ lý AI đang phân tích dữ liệu...</Text>
              </View>
            )}

            {reply && (
              <View style={styles.responseBubble}>
                <View style={styles.responseHeader}>
                  <Ionicons name="sparkles" size={14} color={Palette.primary} />
                  <Text style={styles.responseLabel}>Câu trả lời của AI:</Text>
                </View>
                <Text style={styles.responseText}>{reply}</Text>
              </View>
            )}
          </ScrollView>

          {/* Prompt input */}
          <View style={styles.footerInputRow}>
            <TextInput
              style={styles.textInput}
              placeholder="Đặt câu hỏi về sản phẩm này..."
              placeholderTextColor={Palette.textSub}
              value={question}
              onChangeText={setQuestion}
              onSubmitEditing={() => handleSendPrompt()}
              returnKeyType="send"
            />
            <TouchableOpacity
              style={[
                styles.sendBtn,
                (!question.trim() || isThinking) && styles.sendBtnDisabled,
              ]}
              onPress={() => handleSendPrompt()}
              disabled={!question.trim() || isThinking}
            >
              <Ionicons name="send" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: Palette.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aiBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Palette.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.textHeading,
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    paddingHorizontal: 16,
  },
  bodyContent: {
    paddingVertical: 12,
  },
  productBanner: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: Palette.primary,
    marginBottom: 12,
  },
  productBannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.textHeading,
  },
  productBannerSub: {
    fontSize: 11,
    color: Palette.textSub,
    marginTop: 2,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.textSub,
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  quickChip: {
    backgroundColor: Palette.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
  },
  quickChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.primaryDark,
  },
  loaderBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  loaderText: {
    fontSize: 13,
    color: Palette.textSub,
  },
  responseBubble: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Palette.border,
    marginTop: 8,
  },
  responseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  responseLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.primary,
    textTransform: 'uppercase',
  },
  responseText: {
    fontSize: 13,
    color: Palette.textBody,
    lineHeight: 20,
  },
  footerInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Palette.border,
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 42,
    fontSize: 13,
    color: Palette.textHeading,
  },
  sendBtn: {
    backgroundColor: Palette.primary,
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: Palette.borderDark,
  },
});

