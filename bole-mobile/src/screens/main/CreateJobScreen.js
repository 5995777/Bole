import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { Card, Title, TextInput, Button, useTheme } from 'react-native-paper';

const CreateJobScreen = ({ navigation }) => {
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

  const handleSubmit = () => {
    // TODO: Submit job to API
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
        发布职位
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

export default CreateJobScreen;