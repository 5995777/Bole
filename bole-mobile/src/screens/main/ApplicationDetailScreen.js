import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { Card, Title, Paragraph, Button, Chip, Divider, useTheme } from 'react-native-paper';

const ApplicationDetailScreen = ({ route, navigation }) => {
  const { applicationId, jobId } = route.params;
  const [application, setApplication] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const isRecruiter = user?.role === 'RECRUITER';
  const theme = useTheme();

  // TODO: Fetch application details from API
  useEffect(() => {
    // Temporary mock data
    setApplication({
      id: applicationId || 1,
      jobTitle: '前端开发工程师',
      company: '伯乐科技有限公司',
      status: 'pending',
      appliedAt: '2024-03-20',
      updatedAt: '2024-03-20',
      applicant: {
        name: '张三',
        phone: '13800138000',
        email: 'zhangsan@example.com',
        experience: '3年',
        education: '本科',
        school: '某某大学',
        major: '计算机科学与技术',
      },
      resume: {
        summary: '3年前端开发经验，精通React和Vue框架，有移动端开发经验。',
        skills: ['JavaScript', 'React', 'Vue', 'React Native', 'TypeScript'],
        workHistory: [
          {
            company: '伯乐科技有限公司',
            position: '前端开发工程师',
            duration: '2021-2024',
            description: '负责公司核心产品的前端开发工作',
          },
        ],
      },
    });
  }, [applicationId, jobId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#ffa000';
      case 'interview':
        return '#2196f3';
      case 'accepted':
        return '#4caf50';
      case 'rejected':
        return '#f44336';
      default:
        return '#757575';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return '待处理';
      case 'interview':
        return '面试中';
      case 'accepted':
        return '已录用';
      case 'rejected':
        return '已拒绝';
      default:
        return '未知';
    }
  };

  const handleStatusChange = (newStatus) => {
    // TODO: Update application status via API
    setApplication((prev) => ({ ...prev, status: newStatus }));
  };

  if (!application) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{application.jobTitle}</Title>
          <Paragraph style={styles.company}>{application.company}</Paragraph>
          <View style={styles.statusContainer}>
            <Chip
              mode="outlined"
              textStyle={{ color: getStatusColor(application.status) }}
              style={[styles.statusChip, { borderColor: getStatusColor(application.status) }]}
            >
              {getStatusText(application.status)}
            </Chip>
            <Paragraph style={styles.date}>申请时间：{application.appliedAt}</Paragraph>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>申请人信息</Title>
          <View style={styles.infoRow}>
            <Paragraph>姓名：{application.applicant.name}</Paragraph>
            <Paragraph>联系电话：{application.applicant.phone}</Paragraph>
          </View>
          <View style={styles.infoRow}>
            <Paragraph>电子邮箱：{application.applicant.email}</Paragraph>
            <Paragraph>工作经验：{application.applicant.experience}</Paragraph>
          </View>
          <View style={styles.infoRow}>
            <Paragraph>学历：{application.applicant.education}</Paragraph>
            <Paragraph>专业：{application.applicant.major}</Paragraph>
          </View>
          <Paragraph>毕业院校：{application.applicant.school}</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>个人简介</Title>
          <Paragraph style={styles.content}>{application.resume.summary}</Paragraph>
          <Divider style={styles.divider} />

          <Title>专业技能</Title>
          <View style={styles.skills}>
            {application.resume.skills.map((skill, index) => (
              <Chip
                key={index}
                style={styles.skillChip}
                textStyle={styles.skillText}
              >
                {skill}
              </Chip>
            ))}
          </View>
          <Divider style={styles.divider} />

          <Title>工作经历</Title>
          {application.resume.workHistory.map((work, index) => (
            <View key={index} style={styles.workHistory}>
              <View style={styles.workHeader}>
                <Paragraph style={styles.workCompany}>{work.company}</Paragraph>
                <Paragraph style={styles.workDuration}>{work.duration}</Paragraph>
              </View>
              <Paragraph style={styles.workPosition}>{work.position}</Paragraph>
              <Paragraph style={styles.workDescription}>{work.description}</Paragraph>
            </View>
          ))}
        </Card.Content>
      </Card>

      {isRecruiter && application.status === 'pending' && (
        <View style={styles.actions}>
          <Button
            mode="contained"
            style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => handleStatusChange('interview')}
          >
            邀请面试
          </Button>
          <Button
            mode="outlined"
            style={styles.actionButton}
            onPress={() => handleStatusChange('rejected')}
          >
            婉拒申请
          </Button>
        </View>
      )}

      {isRecruiter && application.status === 'interview' && (
        <View style={styles.actions}>
          <Button
            mode="contained"
            style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => handleStatusChange('accepted')}
          >
            录用申请人
          </Button>
          <Button
            mode="outlined"
            style={styles.actionButton}
            onPress={() => handleStatusChange('rejected')}
          >
            婉拒申请
          </Button>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  company: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  statusChip: {
    height: 28,
  },
  date: {
    color: '#666',
    fontSize: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  content: {
    marginTop: 8,
    lineHeight: 20,
  },
  divider: {
    marginVertical: 16,
  },
  skills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  skillChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#e0e0e0',
  },
  skillText: {
    color: '#333',
  },
  workHistory: {
    marginTop: 12,
  },
  workHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workCompany: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  workDuration: {
    color: '#666',
  },
  workPosition: {
    color: '#333',
    marginTop: 4,
  },
  workDescription: {
    color: '#666',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default ApplicationDetailScreen;