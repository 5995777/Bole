import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { Card, Title, TextInput, Button, useTheme } from 'react-native-paper';

const EditProfileScreen = ({ navigation }) => {
  const { user } = useSelector((state) => state.auth);
  const theme = useTheme();

  // TODO: Fetch user profile from API and handle form submission
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Temporary mock data
    setProfile({
      name: '张三',
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
      skills: 'JavaScript, React, Vue, React Native, TypeScript',
      summary: '3年前端开发经验，精通React和Vue框架，有移动端开发经验。热爱技术，善于团队协作。',
    });
  }, []);

  const handleSubmit = () => {
    // TODO: Submit profile changes to API
    navigation.goBack();
  };

  if (!profile) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>基本信息</Title>
          <TextInput
            label="姓名"
            value={profile.name}
            onChangeText={(text) => setProfile({ ...profile, name: text })}
            style={styles.input}
          />
          <TextInput
            label="电话"
            value={profile.phone}
            onChangeText={(text) => setProfile({ ...profile, phone: text })}
            style={styles.input}
          />
          <TextInput
            label="邮箱"
            value={profile.email}
            onChangeText={(text) => setProfile({ ...profile, email: text })}
            style={styles.input}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>教育背景</Title>
          <TextInput
            label="学历"
            value={profile.education.degree}
            onChangeText={(text) =>
              setProfile({
                ...profile,
                education: { ...profile.education, degree: text },
              })
            }
            style={styles.input}
          />
          <TextInput
            label="学校"
            value={profile.education.school}
            onChangeText={(text) =>
              setProfile({
                ...profile,
                education: { ...profile.education, school: text },
              })
            }
            style={styles.input}
          />
          <TextInput
            label="专业"
            value={profile.education.major}
            onChangeText={(text) =>
              setProfile({
                ...profile,
                education: { ...profile.education, major: text },
              })
            }
            style={styles.input}
          />
          <TextInput
            label="毕业年份"
            value={profile.education.graduationYear}
            onChangeText={(text) =>
              setProfile({
                ...profile,
                education: { ...profile.education, graduationYear: text },
              })
            }
            style={styles.input}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>工作经验</Title>
          <TextInput
            label="工作年限"
            value={profile.experience.years}
            onChangeText={(text) =>
              setProfile({
                ...profile,
                experience: { ...profile.experience, years: text },
              })
            }
            style={styles.input}
          />
          <TextInput
            label="当前职位"
            value={profile.experience.currentPosition}
            onChangeText={(text) =>
              setProfile({
                ...profile,
                experience: { ...profile.experience, currentPosition: text },
              })
            }
            style={styles.input}
          />
          <TextInput
            label="当前公司"
            value={profile.experience.currentCompany}
            onChangeText={(text) =>
              setProfile({
                ...profile,
                experience: { ...profile.experience, currentCompany: text },
              })
            }
            style={styles.input}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>技能与简介</Title>
          <TextInput
            label="技能特长"
            value={profile.skills}
            onChangeText={(text) => setProfile({ ...profile, skills: text })}
            style={styles.input}
            placeholder="使用逗号分隔多个技能"
          />
          <TextInput
            label="个人简介"
            value={profile.summary}
            onChangeText={(text) => setProfile({ ...profile, summary: text })}
            style={styles.input}
            multiline
            numberOfLines={4}
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

export default EditProfileScreen;