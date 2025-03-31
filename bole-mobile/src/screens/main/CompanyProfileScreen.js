import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { Card, Title, Paragraph, Button, Avatar, Divider, useTheme } from 'react-native-paper';

const CompanyProfileScreen = ({ navigation }) => {
  const { user } = useSelector((state) => state.auth);
  const theme = useTheme();

  // TODO: Fetch company profile from API
  const [company, setCompany] = useState(null);

  useEffect(() => {
    // Temporary mock data
    setCompany({
      name: '科技有限公司',
      logo: null,
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
      benefits: [
        '五险一金',
        '年终奖',
        '带薪年假',
        '定期团建',
        '免费零食和下午茶',
        '节日福利',
      ],
      culture: [
        '创新',
        '协作',
        '成长',
        '激情',
      ],
    });
  }, []);

  if (!company) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content style={styles.header}>
          <Avatar.Text
            size={80}
            label={company.name.slice(0, 2)}
            style={styles.avatar}
          />
          <Title style={styles.name}>{company.name}</Title>
          <View style={styles.basicInfo}>
            <Paragraph>{company.industry}</Paragraph>
            <Paragraph>·</Paragraph>
            <Paragraph>{company.size}</Paragraph>
          </View>
          <Paragraph style={styles.location}>{company.location}</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>公司简介</Title>
          <Paragraph style={styles.description}>{company.description}</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>联系方式</Title>
          <View style={styles.infoRow}>
            <Paragraph>电话：{company.contact.phone}</Paragraph>
          </View>
          <View style={styles.infoRow}>
            <Paragraph>邮箱：{company.contact.email}</Paragraph>
          </View>
          <View style={styles.infoRow}>
            <Paragraph>地址：{company.contact.address}</Paragraph>
          </View>
          <View style={styles.infoRow}>
            <Paragraph>网站：{company.website}</Paragraph>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>公司福利</Title>
          <View style={styles.benefitsList}>
            {company.benefits.map((benefit, index) => (
              <Paragraph key={index} style={styles.listItem}>
                • {benefit}
              </Paragraph>
            ))}
          </View>
          <Divider style={styles.divider} />
          <Title>企业文化</Title>
          <View style={styles.cultureList}>
            {company.culture.map((value, index) => (
              <Paragraph key={index} style={styles.listItem}>
                • {value}
              </Paragraph>
            ))}
          </View>
        </Card.Content>
      </Card>

      {user?.role === 'RECRUITER' && (
        <Button
          mode="contained"
          style={styles.editButton}
          onPress={() => navigation.navigate('EditCompany')}
        >
          编辑公司资料
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
  basicInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  location: {
    marginTop: 4,
    color: '#666',
  },
  description: {
    marginTop: 8,
    lineHeight: 20,
  },
  infoRow: {
    marginTop: 8,
  },
  divider: {
    marginVertical: 16,
  },
  benefitsList: {
    marginTop: 8,
  },
  cultureList: {
    marginTop: 8,
  },
  listItem: {
    marginTop: 4,
  },
  editButton: {
    marginTop: 16,
    marginBottom: 32,
  },
});

export default CompanyProfileScreen;