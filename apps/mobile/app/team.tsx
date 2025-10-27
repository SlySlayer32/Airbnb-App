import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import TeamMemberCard from '../components/TeamMemberCard';
import { teamMembers } from '../data/mockData';

export default function TeamScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterRole === 'all' || member.role === filterRole;
    return matchesSearch && matchesFilter;
  });

  const roleFilters = [
    { key: 'all', label: 'All Team', count: teamMembers.length },
    { key: 'cleaner', label: 'Cleaners', count: teamMembers.filter(m => m.role === 'cleaner').length },
    { key: 'cohost', label: 'Co-hosts', count: teamMembers.filter(m => m.role === 'cohost').length },
    { key: 'contractor', label: 'Contractors', count: teamMembers.filter(m => m.role === 'contractor').length },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search team members..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
          {roleFilters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterButton,
                filterRole === filter.key && styles.filterButtonActive
              ]}
              onPress={() => setFilterRole(filter.key)}
            >
              <Text style={[
                styles.filterText,
                filterRole === filter.key && styles.filterTextActive
              ]}>
                {filter.label} ({filter.count})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.content}>
        <View style={styles.actionBar}>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Invite Team Member</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.resultsText}>
          {filteredMembers.length} team members
        </Text>
        
        {filteredMembers.map((member) => (
          <TeamMemberCard
            key={member.id}
            member={member}
            onPress={() => {}}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchInput: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  filtersContainer: {
    flexDirection: 'row',
  },
  filterButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#2563eb',
  },
  filterText: {
    fontSize: 14,
    color: '#374151',
  },
  filterTextActive: {
    color: 'white',
  },
  content: {
    padding: 16,
  },
  actionBar: {
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
});