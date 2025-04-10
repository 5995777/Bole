import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import SafeAreaWrapper from '../../components/SafeAreaWrapper';

// Import actions
import { fetchJobs } from '../../store/slices/jobsSlice';
import { fetchApplications } from '../../store/slices/applicationsSlice';
import { fetchConversations } from '../../store/slices/chatSlice';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { jobs } = useSelector((state) => state.jobs);
  const { applications } = useSelector((state) => state.applications);
  const { conversations } = useSelector((state) => state.chat);
  
  const isRecruiter = user?.role === 'RECRUITER';
  
  useEffect(() => {
    // Fetch initial data
    dispatch(fetchJobs({ limit: 5 }));
    dispatch(fetchApplications({ limit: 5 }));
    dispatch(fetchConversations());
    
    // Set up navigation options
    navigation.setOptions({
      headerTitle: '首页',
    });
  }, [dispatch, navigation]);
  
  const renderRecentJobs = () => {
    if (!jobs || jobs.length === 0) {
      return (
        <Card style={styles.emptyCard}>
          <Card.Content>
            <Paragraph>暂无最近职位</Paragraph>
          </Card.Content>
        </Card>
      );
    }
    
    return jobs.slice(0, 3).map((job) => (
      <Card 
        key={job.id} 
        style={styles.card}
        onPress={() => navigation.navigate('Jobs', { 
          screen: 'JobDetail', 
          params: { jobId: job.id } 
        })}
      >
        <Card.Content>
          <Title>{job.title}</Title>
          <Paragraph>{job.company.name}</Paragraph>
          <Paragraph>{job.location}</Paragraph>
        </Card.Content>
      </Card>
    ));
  };
  
  const renderRecentApplications = () => {
    if (!applications || applications.length === 0) {
      return (
        <Card style={styles.emptyCard}>
          <Card.Content>
            <Paragraph>暂无最近申请</Paragraph>
          </Card.Content>
        </Card>
      );
    }
    
    return applications.slice(0, 3).map((application) => (
      <Card 
        key={application.id} 
        style={styles.card}
        onPress={() => navigation.navigate('Applications', { 
          screen: 'ApplicationDetail', 
          params: { applicationId: application.id } 
        })}
      >
        <Card.Content>
          <Title>{application.job.title}</Title>
          <Paragraph>Status: {application.status}</Paragraph>
          <Paragraph>Applied on: {new Date(application.createdAt).toLocaleDateString()}</Paragraph>
        </Card.Content>
      </Card>
    ));
  };
  
  const renderRecentMessages = () => {
    if (!conversations || conversations.length === 0) {
      return (
        <Card style={styles.emptyCard}>
          <Card.Content>
            <Paragraph>暂无最近消息</Paragraph>
          </Card.Content>
        </Card>
      );
    }
    
    return conversations.slice(0, 3).map((conversation) => {
      const otherParticipant = conversation.participants.find(p => p.id !== user.userId);
      return (
        <Card 
          key={conversation.id} 
          style={styles.card}
          onPress={() => navigation.navigate('Chat', { 
            screen: 'Chat', 
            params: { conversationId: conversation.id } 
          })}
        >
          <Card.Content>
            <Title>{otherParticipant.name}</Title>
            <Paragraph numberOfLines={1}>
              {conversation.lastMessage ? conversation.lastMessage.content : 'No messages yet'}
            </Paragraph>
          </Card.Content>
        </Card>
      );
    });
  };
  
  return (
    <SafeAreaWrapper backgroundColor="#ffffff">
      <ScrollView style={styles.container}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>欢迎 {user?.name}!</Text>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>最近职位</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Jobs')}>
            <Text style={styles.seeAllText}>查看全部</Text>
          </TouchableOpacity>
        </View>
        {renderRecentJobs()}
        {isRecruiter && (
          <Button 
            mode="contained" 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Jobs', { screen: 'CreateJob' })}
          >
            发布新职位
          </Button>
        )}
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>最近申请</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Applications')}>
            <Text style={styles.seeAllText}>查看全部</Text>
          </TouchableOpacity>
        </View>
        {renderRecentApplications()}
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>最近消息</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
            <Text style={styles.seeAllText}>查看全部</Text>
          </TouchableOpacity>
        </View>
        {renderRecentMessages()}
        <Button 
          mode="contained" 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Chat', { screen: 'NewConversation' })}
        >
          开始新对话
        </Button>
      </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  welcomeContainer: {
    backgroundColor: '#1a237e',
    padding: 24,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'PingFang SC',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    marginHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    fontFamily: 'PingFang SC',
  },
  seeAllText: {
    color: '#1a237e',
    fontWeight: '600',
    fontFamily: 'PingFang SC',
  },
  card: {
    marginBottom: 12,
    borderRadius: 8,
    elevation: 1,
    backgroundColor: '#fff',
  },
  emptyCard: {
    marginBottom: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  actionButton: {
    marginTop: 12,
    backgroundColor: '#1a237e',
    borderRadius: 8,
  },
});

export default HomeScreen;