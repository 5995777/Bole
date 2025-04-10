import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { Card, Title, Paragraph, Button, FAB, useTheme } from 'react-native-paper';
import SafeAreaWrapper from '../../components/SafeAreaWrapper';

const JobsScreen = ({ navigation }) => {
  const [jobs, setJobs] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const isRecruiter = user?.role === 'RECRUITER';
  const theme = useTheme();

  // TODO: Fetch jobs from API
  useEffect(() => {
    // Temporary mock data
    setJobs([
      {
        id: 1,
        title: '前端开发工程师',
        company: '科技有限公司',
        location: '北京',
        salary: '15k-25k',
        description: '负责公司产品的前端开发工作',
      },
      {
        id: 2,
        title: '后端开发工程师',
        company: '互联网公司',
        location: '上海',
        salary: '20k-35k',
        description: '负责公司核心系统的后端开发',
      },
    ]);
  }, []);

  const renderItem = ({ item }) => (
    <Card style={styles.card} onPress={() => navigation.navigate('JobDetail', { jobId: item.id })}>
      <Card.Content>
        <Title>{item.title}</Title>
        <Paragraph style={styles.company}>{item.company}</Paragraph>
        <View style={styles.details}>
          <Paragraph>{item.location}</Paragraph>
          <Paragraph>{item.salary}</Paragraph>
        </View>
        <Paragraph numberOfLines={2} style={styles.description}>
          {item.description}
        </Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaWrapper backgroundColor="#ffffff">
      <View style={styles.container}>
        <FlatList
        data={jobs}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
      {isRecruiter && (
        <FAB
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          icon="plus"
          onPress={() => navigation.navigate('CreateJob')}
        />
      )}
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  company: {
    marginTop: 4,
    color: '#666',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  description: {
    marginTop: 8,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 24,
    right: 0,
    bottom: 0,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
});

export default JobsScreen;