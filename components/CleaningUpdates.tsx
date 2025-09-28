import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, FlatList, Modal, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cleaningUpdateService, CleaningUpdate } from '@/services/cleaningUpdateService';

interface CleaningUpdatesProps {
  sessionId: string;
  onClose: () => void;
}

export default function CleaningUpdates({ sessionId, onClose }: CleaningUpdatesProps) {
  const [updates, setUpdates] = useState<CleaningUpdate[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadUpdates();
  }, [sessionId]);

  const loadUpdates = async () => {
    try {
      setLoading(true);
      const sessionUpdates = await cleaningUpdateService.getSessionUpdates(sessionId);
      setUpdates(sessionUpdates);
    } catch (error) {
      Alert.alert('Error', 'Failed to load updates');
    } finally {
      setLoading(false);
    }
  };

  const sendUpdate = async () => {
    if (!newMessage.trim()) return;

    try {
      setSending(true);
      await cleaningUpdateService.addUpdate(sessionId, {
        update_type: 'note',
        message: newMessage.trim(),
        requires_response: false,
        is_urgent: false
      });
      
      setNewMessage('');
      await loadUpdates();
    } catch (error) {
      Alert.alert('Error', 'Failed to send update');
    } finally {
      setSending(false);
    }
  };

  const reportIssue = async (isUrgent: boolean) => {
    if (!newMessage.trim()) {
      Alert.alert('Error', 'Please enter issue details');
      return;
    }

    try {
      setSending(true);
      await cleaningUpdateService.reportIssue(sessionId, {
        message: newMessage.trim(),
        is_urgent: isUrgent
      });
      
      setNewMessage('');
      await loadUpdates();
      Alert.alert('Success', `${isUrgent ? 'Urgent issue' : 'Issue'} reported successfully`);
    } catch (error) {
      Alert.alert('Error', 'Failed to report issue');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'arrival': return 'location';
      case 'status': return 'information-circle';
      case 'issue': return 'warning';
      case 'completion': return 'checkmark-circle';
      case 'note': return 'chatbubble';
      default: return 'chatbubble';
    }
  };

  const getUpdateColor = (update: CleaningUpdate) => {
    if (update.is_urgent) return '#ef4444';
    switch (update.update_type) {
      case 'arrival': return '#3b82f6';
      case 'issue': return '#f59e0b';
      case 'completion': return '#10b981';
      default: return '#6b7280';
    }
  };

  const renderUpdate = ({ item }: { item: CleaningUpdate }) => (
    <View style={[styles.updateItem, item.is_urgent && styles.urgentUpdate]}>
      <View style={styles.updateHeader}>
        <View style={styles.updateMeta}>
          <Ionicons 
            name={getUpdateIcon(item.update_type)} 
            size={16} 
            color={getUpdateColor(item)} 
          />
          <Text style={styles.updateUser}>
            {item.user_name} ({item.user_role})
          </Text>
          {item.is_urgent && (
            <View style={styles.urgentBadge}>
              <Text style={styles.urgentText}>URGENT</Text>
            </View>
          )}
        </View>
        <Text style={styles.updateTime}>
          {formatDate(item.created_at)} at {formatTime(item.created_at)}
        </Text>
      </View>
      
      <Text style={styles.updateMessage}>{item.message}</Text>
      
      {item.photo_urls && item.photo_urls.length > 0 && (
        <View style={styles.photosContainer}>
          {item.photo_urls.map((url, index) => (
            <Image key={index} source={{ uri: url }} style={styles.updatePhoto} />
          ))}
        </View>
      )}
      
      {item.requires_response && (
        <View style={styles.responseRequired}>
          <Ionicons name="alert-circle" size={16} color="#f59e0b" />
          <Text style={styles.responseText}>Response required</Text>
        </View>
      )}
    </View>
  );

  return (
    <Modal
      visible={true}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Cleaning Updates</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={updates}
          keyExtractor={(item) => item.id}
          renderItem={renderUpdate}
          style={styles.updatesList}
          contentContainerStyle={styles.updatesContainer}
          refreshing={loading}
          onRefresh={loadUpdates}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="chatbubbles" size={48} color="#d1d5db" />
              <Text style={styles.emptyText}>No updates yet</Text>
              <Text style={styles.emptySubtext}>Send a message to start the conversation</Text>
            </View>
          }
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.messageInput}
            placeholder="Add an update or report an issue..."
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            maxLength={500}
          />
          
          <View style={styles.inputActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.sendButton]}
              onPress={sendUpdate}
              disabled={sending || !newMessage.trim()}
            >
              <Ionicons name="send" size={16} color="white" />
              <Text style={styles.actionButtonText}>Send</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.issueButton]}
              onPress={() => reportIssue(false)}
              disabled={sending || !newMessage.trim()}
            >
              <Ionicons name="warning" size={16} color="#f59e0b" />
              <Text style={[styles.actionButtonText, styles.issueButtonText]}>Issue</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.urgentButton]}
              onPress={() => reportIssue(true)}
              disabled={sending || !newMessage.trim()}
            >
              <Ionicons name="alert" size={16} color="white" />
              <Text style={styles.actionButtonText}>Urgent</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  closeButton: {
    padding: 4,
  },
  updatesList: {
    flex: 1,
  },
  updatesContainer: {
    padding: 16,
  },
  updateItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  urgentUpdate: {
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  updateHeader: {
    marginBottom: 8,
  },
  updateMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  updateUser: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  urgentBadge: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  urgentText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  updateTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  updateMessage: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 8,
  },
  photosContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  updatePhoto: {
    width: 60,
    height: 60,
    borderRadius: 4,
  },
  responseRequired: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    padding: 6,
    borderRadius: 4,
    gap: 4,
  },
  responseText: {
    fontSize: 12,
    color: '#92400e',
    fontWeight: '500',
  },
  inputContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  messageInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    maxHeight: 100,
    marginBottom: 12,
  },
  inputActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
    flex: 1,
    justifyContent: 'center',
  },
  sendButton: {
    backgroundColor: '#007AFF',
  },
  issueButton: {
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  urgentButton: {
    backgroundColor: '#ef4444',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  issueButtonText: {
    color: '#f59e0b',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
    marginTop: 16,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#d1d5db',
    marginTop: 4,
  },
});