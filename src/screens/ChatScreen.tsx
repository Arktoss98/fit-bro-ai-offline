import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../config/theme';
import { useAppStore } from '../services/store';
import type { ChatMessage } from '../models/types';

export default function ChatScreen() {
  const { t } = useTranslation();
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const chatMessages = useAppStore((s) => s.chatMessages);
  const addMessage = useAppStore((s) => s.addMessage);
  const isGenerating = useAppStore((s) => s.isGenerating);
  const isModelLoaded = useAppStore((s) => s.isModelLoaded);

  const sendMessage = () => {
    const text = inputText.trim();
    if (!text || isGenerating) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    addMessage(userMessage);
    setInputText('');

    // TODO: Integracja z Gemma 4 E4B — na razie placeholder
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '🚧 Model AI nie jest jeszcze załadowany. Integracja z Gemma 4 E4B w trakcie implementacji.',
        timestamp: new Date().toISOString(),
      };
      addMessage(aiMessage);
    }, 500);
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble]}>
        {!isUser && <Text style={styles.aiLabel}>Trener AI</Text>}
        <Text style={[styles.messageText, isUser && styles.userText]}>
          {item.content}
        </Text>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    );
  };

  const showGreeting = chatMessages.length === 0;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      {showGreeting ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🤖</Text>
          <Text style={styles.emptyTitle}>{t('chat.trainerGreeting')}</Text>
          {!isModelLoaded && (
            <View style={styles.modelStatus}>
              <Text style={styles.modelStatusText}>
                Model AI: oczekuje na załadowanie Gemma 4 E4B
              </Text>
            </View>
          )}
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={chatMessages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        />
      )}

      {isGenerating && (
        <View style={styles.thinkingBar}>
          <Text style={styles.thinkingText}>{t('chat.thinking')}</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder={t('chat.placeholder')}
          placeholderTextColor={COLORS.textMuted}
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendDisabled]}
          onPress={sendMessage}
          disabled={!inputText.trim() || isGenerating}
        >
          <Text style={styles.sendIcon}>{'>'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 26,
  },
  modelStatus: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.md,
  },
  modelStatusText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.warning,
  },
  messageList: {
    padding: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
  },
  userBubble: {
    backgroundColor: COLORS.primary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: COLORS.surface,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  aiLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.secondary,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  messageText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    lineHeight: 22,
  },
  userText: {
    color: '#FFFFFF',
  },
  timestamp: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
    alignSelf: 'flex-end',
  },
  thinkingBar: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  thinkingText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },
  sendDisabled: {
    opacity: 0.4,
  },
  sendIcon: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
  },
});
