import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { Card, Title, TextInput, Button, useTheme } from 'react-native-paper';

const EditCompanyScreen = ({ navigation }) => {
  const { user } = useSelector((state) => state.auth);
  const theme = useTheme();

  // TODO: Fetch company profile from API and handle form submission
  const [company, setCompany] = useState(null);

  useEffect(() => {
    // Temporary mock data
    setCompany({
      name: '科技有限公司',
      size: '500-1000人',
      industry: '互联网',
      location: '北京市朝阳区',
      website: 'www.example.com',
      contact: {
        phone: '010-12345678',
        email: 'hr@example.com',
        address: '北京市朝阳区某某大厦',
      },
      description: '我们是一家快速成长的科技公司，致力于为用户提供优质的互联网服务。公司拥有优秀的研发团队和良好的工作环境，欢迎优秀人才加入。',
      benefits: '五险一金, 年终奖, 带薪年假, 定期团建, 免费零食和下午茶, 节日福利',
      culture: '创新, 协作, 成长, 激情',
    });
  }, []);

  const handleSubmit = () => {
    // TODO: Submit company changes to API
    navigation.goBack();
  };

  if (!company) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>基本信息</Title>
          <TextInput
            label="公司名称"
            value={company.name}
            onChangeText={(text) => setCompany({ ...company, name: text })}
            style={styles.input}
          />
          <TextInput
            label="公司规模"
            value={company.size}
            onChangeText={(text) => setCompany({ ...company, size: text })}
            style={styles.input}
          />
          <TextInput
            label="所属行业"
            value={company.industry}
            onChangeText={(text) => setCompany({ ...company, industry: text })}
            style={styles.input}
          />
          <TextInput
            label="公司地址"
            value={company.location}
            onChangeText={(text) => setCompany({ ...company, location: text })}
            style={styles.input}
          />
          <TextInput
            label="公司网站"
            value={company.website}
            onChangeText={(text) => setCompany({ ...company, website: text })}
            style={styles.input}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>联系方式</Title>
          <TextInput
            label="联系电话"
            value={company.contact.phone}
            onChangeText={(text) =>
              setCompany({
                ...company,
                contact: { ...company.contact, phone: text },
              })
            }
            style={styles.input}
          />
          <TextInput
            label="联系邮箱"
            value={company.contact.email}
            onChangeText={(text) =>
              setCompany({
                ...company,
                contact: { ...company.contact, email: text },
              })
            }
            style={styles.input}
          />
          <TextInput
            label="详细地址"
            value={company.contact.address}
            onChangeText={(text) =>
              setCompany({
                ...company,
                contact: { ...company.contact, address: text },
              })
            }
            style={styles.input}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>公司介绍</Title>
          <TextInput
            label="公司简介"
            value={company.description}
            onChangeText={(text) => setCompany({ ...company, description: text })}
            style={styles.input}
            multiline
            numberOfLines={4}
          />
          <TextInput
            label="公司福利"
            value={company.benefits}
            onChangeText={(text) => setCompany({ ...company, benefits: text })}
            style={styles.input}
            placeholder="使用逗号分隔多个福利项目"
          />
          <TextInput
            label="企业文化"
            value={company.culture}
            onChangeText={(text) => setCompany({ ...company, culture: text })}
            style={styles.input}
            placeholder="使用逗号分隔多个文化价值观"
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

export default EditCompanyScreen;