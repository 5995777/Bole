import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import SafeAreaWrapper from '../../components/SafeAreaWrapper';

import globalStyles from '../../styles/globalStyles';
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
              <Text style={globalStyles.text}>{job.company.name}</Text>
              <Text style={globalStyles.smallText}>{job.location}</Text>
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
              <Text style={globalStyles.text}>Status: {application.status}</Text>
              <Text style={globalStyles.smallText}>Applied on: {new Date(application.createdAt).toLocaleDateString()}</Text>
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
              <Text style={globalStyles.text}>{otherParticipant.name}</Text>
              <Text style={globalStyles.text} numberOfLines={1}>
                {conversation.lastMessage ? conversation.lastMessage.content : 'No messages yet'}
              </Text>
            </Card.Content>
          </Card>
      );
    });
  };
  
  return (
    <SafeAreaWrapper backgroundColor="#ffffff">
        <ScrollView style={[globalStyles.container]}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>欢迎 {user?.name}!</Text>
            </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={globalStyles.title}>最近职位</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Jobs')}>
                <Text style={globalStyles.linkText}>查看全部</Text>
              </TouchableOpacity>
            </View>
            {renderRecentJobs()}
            {isRecruiter && (
                <Button mode="contained" style={globalStyles.secondaryButton}
                        onPress={() => navigation.navigate('Jobs', { screen: 'CreateJob' })}>
                  发布新职位
                </Button>
            )}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={globalStyles.title}>最近申请</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Applications')}>
                <Text style={globalStyles.linkText}>查看全部</Text>
              </TouchableOpacity>
            </View>
            {renderRecentApplications()}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={globalStyles.title}>最近消息</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
                <Text style={globalStyles.linkText}>查看全部</Text>
              </TouchableOpacity>
            </View>
            {renderRecentMessages()}
            <Button mode="contained" style={globalStyles.secondaryButton}
                    onPress={() => navigation.navigate('Chat', { screen: 'NewConversation' })}>
              开始新对话
            </Button>
          </View>
        </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: globalStyles.backgroundColor,
  },

  welcomeContainer: {
      backgroundColor: globalStyles.primaryColor,
      padding: 20,
      borderRadius: 10,
      margin: 15,
      alignItems: 'center',
      ...globalStyles.shadow,
  },
  welcomeText: {
      fontSize: 22,
      color: globalStyles.white,
      fontWeight: 'bold',
  },

  section: {
      ...globalStyles.cardContainer,
      marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

    card: {
        ...globalStyles.card,
        marginBottom: 15,
    },

  emptyCard: {
      ...globalStyles.cardContainer,
      backgroundColor: globalStyles.backgroundColor,
      padding: 15,
      alignItems: 'center',
  },

    emptyText: {
        ...globalStyles.text,
        color: globalStyles.lightTextColor,
    }
});

export default HomeScreen;