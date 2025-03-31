import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { Card, Title, TextInput, Button, useTheme } from 'react-native-paper';

const EditJobScreen = ({ route, navigation }) => {
  const { jobId } = route.params;
  const { user } = useSelector((state) => state.auth);
  const theme = useTheme();

  const [job, setJob] = useState({
    title: '',
    company: user?.company || '',
    location: '',
    salary: '',
    description: '',
    requirements: '',
    benefits: '',
  });

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
    });
  }, [jobId]);

  const handleSubmit = () => {
    // TODO: Submit updated job to API
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>基本信息</Title>
          <TextInput
            label="职位名称"
            value={job.title}
            onChangeText={(text) => setJob({ ...job, title: text })}
            style={styles.input}
          />
          <TextInput
            label="工作地点"
            value={job.location}
            onChangeText={(text) => setJob({ ...job, location: text })}
            style={styles.input}
          />
          <TextInput
            label="薪资范围"
            value={job.salary}
            onChangeText={(text) => setJob({ ...job, salary: text })}
            style={styles.input}
            placeholder="例如：15k-25k"
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>职位详情</Title>
          <TextInput
            label="职位描述"
            value={job.description}
            onChangeText={(text) => setJob({ ...job, description: text })}
            style={styles.input}
            multiline
            numberOfLines={4}
            placeholder="请详细描述该职位的工作内容、职责等"
          />
          <TextInput
            label="任职要求"
            value={job.requirements}
            onChangeText={(text) => setJob({ ...job, requirements: text })}
            style={styles.input}
            multiline
            numberOfLines={4}
            placeholder="请列出该职位所需的技能、经验等要求"
          />
          <TextInput
            label="福利待遇"
            value={job.benefits}
            onChangeText={(text) => setJob({ ...job, benefits: text })}
            style={styles.input}
            multiline
            numberOfLines={4}
            placeholder="请列出该职位提供的福利待遇"
          />
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        style={styles.submitButton}
        onPress={handleSubmit}
      >
        保存修改
      </Button>
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
  input: {
    marginTop: 8,
  },
  submitButton: {
    marginTop: 16,
    marginBottom: 32,
  },
});

export default EditJobScreen;