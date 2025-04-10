import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { Card, Title, Paragraph, Button, Divider, useTheme } from 'react-native-paper';

const JobDetailScreen = ({ route, navigation }) => {
  const { jobId } = route.params;
  const [job, setJob] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const isRecruiter = user?.role === 'RECRUITER';
  const theme = useTheme();

  // TODO: Fetch job details from API
  useEffect(() => {
    // Temporary mock data
    setJob({
      id: jobId,
      title: '前端开发工程师',
      company: '伯乐科技有限公司',
      location: '北京',
      salary: '15k-25k',
      description: '负责公司产品的前端开发工作，包括但不限于：\n1. 负责公司产品的前端开发\n2. 与后端工程师协作完成功能开发\n3. 优化前端性能和用户体验\n4. 参与产品需求讨论和技术方案设计',
      requirements: '1. 3年以上前端开发经验\n2. 精通React、Vue等主流框架\n3. 良好的代码风格和团队协作能力\n4. 有移动端开发经验优先',
      benefits: '1. 优秀的薪资待遇\n2. 五险一金\n3. 年终奖\n4. 定期团建\n5. 免费零食和下午茶',
      companyInfo: {
        name: '伯乐科技有限公司',
        size: '500-1000人',
        industry: '互联网',
        description: '我们是一家快速成长的科技公司，致力于为用户提供优质的互联网服务。',
      },
    });
  }, [jobId]);

  if (!job) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{job.title}</Title>
          <View style={styles.header}>
            <Paragraph style={styles.company}>{job.company}</Paragraph>
            <Paragraph style={styles.salary}>{job.salary}</Paragraph>
          </View>
          <Paragraph style={styles.location}>{job.location}</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>职位描述</Title>
          <Paragraph style={styles.content}>{job.description}</Paragraph>
          <Divider style={styles.divider} />
          
          <Title>任职要求</Title>
          <Paragraph style={styles.content}>{job.requirements}</Paragraph>
          <Divider style={styles.divider} />
          
          <Title>福利待遇</Title>
          <Paragraph style={styles.content}>{job.benefits}</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>公司信息</Title>
          <Paragraph style={styles.companyName}>{job.companyInfo.name}</Paragraph>
          <View style={styles.companyDetails}>
            <Paragraph>{job.companyInfo.size}</Paragraph>
            <Paragraph>{job.companyInfo.industry}</Paragraph>
          </View>
          <Paragraph style={styles.content}>{job.companyInfo.description}</Paragraph>
        </Card.Content>
      </Card>

      {!isRecruiter && (
        <Button
          mode="contained"
          style={styles.applyButton}
          onPress={() => navigation.navigate('ApplicationDetail', { jobId: job.id })}
        >
          申请职位
        </Button>
      )}

      {isRecruiter && (
        <Button
          mode="contained"
          style={styles.applyButton}
          onPress={() => navigation.navigate('EditJob', { jobId: job.id })}
        >
          编辑职位
        </Button>
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
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  company: {
    fontSize: 16,
    color: '#666',
  },
  salary: {
    fontSize: 16,
    color: '#00a0e9',
    fontWeight: 'bold',
  },
  location: {
    marginTop: 4,
    color: '#666',
  },
  content: {
    marginTop: 8,
    lineHeight: 20,
  },
  divider: {
    marginVertical: 16,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  companyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  applyButton: {
    marginTop: 16,
    marginBottom: 32,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default JobDetailScreen;