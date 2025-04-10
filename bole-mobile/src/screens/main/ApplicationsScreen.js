import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { Card, Title, Paragraph, Chip, useTheme } from 'react-native-paper';
import globalStyles from '../../styles/globalStyles';
import { formatDate } from '../../utils/formatDate';
const ApplicationsScreen = ({ navigation }) => {
  const [applications, setApplications] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const isRecruiter = user?.role === 'RECRUITER';
  const theme = useTheme();

  // TODO: Fetch applications from API
  useEffect(() => {
    // Temporary mock data
    setApplications([
      {
        id: 1,
        jobTitle: '前端开发工程师',
        company: '科技有限公司',
        status: 'pending',
        appliedAt: '2024-03-20',
        updatedAt: '2024-03-20',
      },
      {
        id: 2,
        jobTitle: '后端开发工程师',
        company: '互联网公司',
        status: 'interview',
        appliedAt: '2024-03-19',
        updatedAt: '2024-03-21',
      },
    ]);
  }, []);

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

  const renderItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('ApplicationDetail', { applicationId: item.id })}
    >
      <Card.Content>
        <Title>{item.jobTitle}</Title>
        <Paragraph style={styles.company}>{item.company}</Paragraph>
        <View style={styles.details}>
          <Chip
            mode="outlined"
            textStyle={{ color: getStatusColor(item.status) }}
            style={[styles.statusChip, { borderColor: getStatusColor(item.status) }]}
          >
            {getStatusText(item.status)}
          </Chip>
          <Paragraph style={styles.date}>
            申请时间：{formatDate(item.appliedAt)}
          </Paragraph>
        </View>
      </Card.Content>
    </Card>
  );

  return (
      <View style={globalStyles.container}>
        <FlatList
            data={applications}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
        />
      </View>
  );
};

const styles = StyleSheet.create({

  list: {
    padding: 15,
  },
  card: {
    ...globalStyles.card,
    marginBottom: 15,
  },
  company: {
    ...globalStyles.text,
    marginTop: 5,
  },
  jobTitle: {
    ...globalStyles.title,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  chip: {
    borderRadius: 5,
    height: 30,
    paddingHorizontal: 10,
  },
  date: {
    ...globalStyles.smallText,
    fontSize: 14,
  },
});

export default ApplicationsScreen;