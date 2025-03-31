import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { Card, Title, Paragraph, Button, Avatar, Divider, useTheme } from 'react-native-paper';

const ProfileScreen = ({ navigation }) => {
  const { user } = useSelector((state) => state.auth);
  const theme = useTheme();

  // TODO: Fetch user profile from API
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Temporary mock data
    setProfile({
      name: '张三',
      avatar: null,
      phone: '13800138000',
      email: 'zhangsan@example.com',
      education: {
        degree: '本科',
        school: '某某大学',
        major: '计算机科学与技术',
        graduationYear: '2020',
      },
      experience: {
        years: '3年',
        currentPosition: '前端开发工程师',
        currentCompany: '科技有限公司',
      },
      skills: ['JavaScript', 'React', 'Vue', 'React Native', 'TypeScript'],
      summary: '3年前端开发经验，精通React和Vue框架，有移动端开发经验。热爱技术，善于团队协作。',
    });
  }, []);

  if (!profile) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content style={styles.header}>
          <Avatar.Text
            size={80}
            label={profile.name.slice(0, 2)}
            style={styles.avatar}
          />
          <Title style={styles.name}>{profile.name}</Title>
          <Paragraph style={styles.position}>{profile.experience.currentPosition}</Paragraph>
          <Paragraph style={styles.company}>{profile.experience.currentCompany}</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>联系方式</Title>
          <View style={styles.infoRow}>
            <Paragraph>电话：{profile.phone}</Paragraph>
          </View>
          <View style={styles.infoRow}>
            <Paragraph>邮箱：{profile.email}</Paragraph>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>教育背景</Title>
          <View style={styles.infoRow}>
            <Paragraph>学历：{profile.education.degree}</Paragraph>
          </View>
          <View style={styles.infoRow}>
            <Paragraph>学校：{profile.education.school}</Paragraph>
          </View>
          <View style={styles.infoRow}>
            <Paragraph>专业：{profile.education.major}</Paragraph>
          </View>
          <View style={styles.infoRow}>
            <Paragraph>毕业年份：{profile.education.graduationYear}</Paragraph>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>工作经验</Title>
          <View style={styles.infoRow}>
            <Paragraph>工作年限：{profile.experience.years}</Paragraph>
          </View>
          <View style={styles.infoRow}>
            <Paragraph>当前职位：{profile.experience.currentPosition}</Paragraph>
          </View>
          <View style={styles.infoRow}>
            <Paragraph>当前公司：{profile.experience.currentCompany}</Paragraph>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>个人简介</Title>
          <Paragraph style={styles.summary}>{profile.summary}</Paragraph>
          <Divider style={styles.divider} />
          <Title>技能特长</Title>
          <View style={styles.skills}>
            {profile.skills.map((skill, index) => (
              <Paragraph key={index} style={styles.skill}>
                • {skill}
              </Paragraph>
            ))}
          </View>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        style={styles.editButton}
        onPress={() => navigation.navigate('EditProfile')}
      >
        编辑资料
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
  header: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  avatar: {
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  position: {
    fontSize: 16,
    marginTop: 4,
  },
  company: {
    color: '#666',
    marginTop: 4,
  },
  infoRow: {
    marginTop: 8,
  },
  divider: {
    marginVertical: 16,
  },
  summary: {
    marginTop: 8,
    lineHeight: 20,
  },
  skills: {
    marginTop: 8,
  },
  skill: {
    marginTop: 4,
  },
  editButton: {
    marginTop: 16,
    marginBottom: 32,
  },
});

export default ProfileScreen;