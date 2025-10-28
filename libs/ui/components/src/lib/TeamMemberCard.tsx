import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TeamMember } from '../types';

interface TeamMemberCardProps {
  member: TeamMember;
  onPress: () => void;
}

export default function TeamMemberCard({
  member,
  onPress,
}: TeamMemberCardProps) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'cleaner':
        return '#10b981';
      case 'cohost':
        return '#3b82f6';
      case 'contractor':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }
    if (hasHalfStar) {
      stars.push('☆');
    }
    return stars.join('');
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: member.imageUrl }} style={styles.avatar} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{member.name}</Text>
          <View
            style={[
              styles.role,
              { backgroundColor: getRoleColor(member.role) },
            ]}
          >
            <Text style={styles.roleText}>{member.role}</Text>
          </View>
        </View>
        <Text style={styles.contact}>{member.email}</Text>
        <Text style={styles.contact}>{member.phone}</Text>
        <View style={styles.footer}>
          <Text style={styles.rating}>
            {renderStars(member.rating)} {member.rating}
          </Text>
          <Text style={styles.properties}>
            {member.assignedProperties.length} properties
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
  },
  role: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  contact: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  rating: {
    fontSize: 14,
    color: '#f59e0b',
    fontWeight: '600',
  },
  properties: {
    fontSize: 12,
    color: '#374151',
  },
});
