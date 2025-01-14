import { Student } from '@prisma/client';
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
    color: '#333'
  },
  header: {
    fontSize: 20,
    marginBottom: 5,
    textAlign: 'center',
    color: '#2c3e50',
    fontWeight: 'bold',
    letterSpacing: 1.5
  },
  section: {
    marginBottom: 10,
    paddingHorizontal: 10
  },
  infoText: {
    fontSize: 16,
    marginBottom: 4,
    color: '#555'
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#ccc',
    marginTop: 10,
    borderRadius: 5,
    overflow: 'hidden'
  },
  tableHeader: {
    backgroundColor: '#2c3e50',
    color: '#fff'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderBottomStyle: 'solid'
  },
  tableRowOdd: {
    backgroundColor: '#f9f9f9'
  },
  tableRowEven: {
    backgroundColor: '#fff'
  },
  tableCell: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    fontSize: 11,
    color: '#444',
    textAlign: 'center'
  },
  headerCell: {
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'uppercase'
  },
  bold: {
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  presentText: {
    color: '#2ecc71',
    fontWeight: 'bold'
  },
  absentText: {
    color: '#e74c3c',
    fontWeight: 'bold'
  }
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const AttendancePDF = ({
  lectureName,
  selectedDate,
  students,
  attendanceData
}: any) => {
  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.header}>Attendance Report</Text>
        <View style={styles.section}>
          {lectureName && (
            <Text style={styles.infoText}>
              <Text style={styles.bold}>Lecture Name:</Text>{' '}
              {lectureName || 'N/A'}
            </Text>
          )}
          <Text style={styles.infoText}>
            <Text style={styles.bold}>Date:</Text> {formatDate(selectedDate)}
          </Text>
        </View>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, styles.headerCell]}>No.</Text>
            <Text style={[styles.tableCell, styles.headerCell, { flex: 3 }]}>
              Student
            </Text>
            <Text style={[styles.tableCell, styles.headerCell, { flex: 2 }]}>
              Enrollment No.
            </Text>
            <Text style={[styles.tableCell, styles.headerCell, { flex: 2 }]}>
              Roll No.
            </Text>
            <Text style={[styles.tableCell, styles.headerCell, { flex: 2 }]}>
              Attendance
            </Text>
          </View>
          {students.map((student: Student, index: number) => {
            const isPresent = attendanceData.some(
              (item: any) =>
                item.id === student.id.toString() && item.status === 'present'
            );
            return (
              <View
                style={[
                  styles.tableRow,
                  index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
                ]}
                key={index}>
                <Text style={[styles.tableCell]}>{index + 1}</Text>
                <Text
                  style={[
                    styles.tableCell,
                    { flex: 3 },
                    isPresent ? styles.presentText : styles.absentText
                  ]}>
                  {student.lastName} {student.firstName}
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    { flex: 2 },
                    isPresent ? styles.presentText : styles.absentText
                  ]}>
                  {student.enrollmentNumber}
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    { flex: 2 },
                    isPresent ? styles.presentText : styles.absentText
                  ]}>
                  {student.rollNo}
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    { flex: 2 },
                    isPresent ? styles.presentText : styles.absentText
                  ]}>
                  {isPresent ? '✔ Present' : '✘ Absent'}
                </Text>
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
};

export default AttendancePDF;
