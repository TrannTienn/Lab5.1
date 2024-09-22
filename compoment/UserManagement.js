// src/UserManagement.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { db } from './firebaseConfig'; // Import Firebase config
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [editingId, setEditingId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const userList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      userList.sort((a, b) => a.name.localeCompare(b.name));
      setUsers(userList);
    } catch (error) {
      console.error("Lỗi lấy danh sách người dùng: ", error);
      Alert.alert("Lỗi lấy danh sách người dùng:");
    }
    setLoading(false);
  };

  const validateInput = () => {
    const nameRegex = /^[\p{L}\s]*$/u; // Sử dụng Unicode để cho phép tất cả các ký tự chữ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Kiểm tra định dạng email
    const ageValue = parseInt(age); // Chuyển đổi tuổi thành số nguyên

    if (!name || !email || !age) {
      Alert.alert("Vui lòng điền đầy đủ thông tin!");
      return false;
    }

    if (!nameRegex.test(name)) {
      Alert.alert("Tên không được chứa ký tự đặc biệt!");
      return false;
    }

    if (!emailRegex.test(email)) {
      Alert.alert("Email không đúng định dạng!");
      return false;
    }

    if (isNaN(ageValue) || ageValue < 15 || ageValue > 50) {
      Alert.alert("Tuổi phải nằm trong khoảng từ 15 đến 50!");
      return false;
    }

    return true;
  };

  const addUser = async () => {
    if (!validateInput()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "users"), { name, email, age });
      fetchUsers();
      setName('');
      setEmail('');
      setAge('');
    } catch (error) {
      console.error("Lỗi thêm người dùng: ", error);
      Alert.alert("Lỗi thêm người dùng:");
    }
    setLoading(false);
  };

  const updateUser = async () => {
    if (!editingId || !validateInput()) return;

    setLoading(true);
    try {
      const userDoc = doc(db, "users", editingId);
      await updateDoc(userDoc, { name, email, age });
      fetchUsers();
      setEditingId(null);
      setName('');
      setEmail('');
      setAge('');
    } catch (error) {
      console.error("Lỗi cập nhật người dùng:  ", error);
      Alert.alert("Lỗi cập nhật người dùng: ");
    }
    setLoading(false);
  };

  const deleteUser = async (id) => {
    setLoading(true);
    try {
      const userDoc = doc(db, "users", id);
      await deleteDoc(userDoc);
      fetchUsers();
    } catch (error) {
      console.error("Lỗi xóa người dùng: ", error);
      Alert.alert("Lỗi xóa người dùng:");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" />}
      
      {/* Thanh tiêu đề */}
      <View style={styles.header}>
        <Text style={styles.headerText}>QUẢN LÝ NGƯỜI DÙNG</Text>
      </View>

      <TextInput 
        style={styles.input} 
        placeholder="Tên" 
        value={name} 
        onChangeText={setName} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Tuổi" 
        value={age} 
        onChangeText={setAge} 
        keyboardType="numeric" 
      />
      <Button 
        title={editingId ? "Cập nhật" : "Thêm người dùng"} 
        onPress={editingId ? updateUser : addUser} 
        color="#007BFF"
      />
      <FlatList
        data={users}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Text style={styles.userText}>{item.name} - {item.email} - {item.age}</Text>
            <View style={styles.buttonContainer}>
              <Button 
                title="Sửa" 
                onPress={() => { 
                  setEditingId(item.id); 
                  setName(item.name); 
                  setEmail(item.email); 
                  setAge(item.age); 
                }} 
                color="#FFC107" 
             
              />
              <Button 
                title="Xóa" 
                onPress={() => deleteUser(item.id)} 
                color="#DC3545" 
               
              />
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  header: {
    backgroundColor: '#007BFF', // Màu nền cho thanh tiêu đề
    padding: 20,
    alignItems: 'center',
    marginBottom: 10 
  },
  headerText: {
    color: '#FFFFFF', // Màu chữ
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#CED4DA',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  userItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CED4DA',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa', // Màu nền cho từng mục
    borderRadius: 35,
    marginVertical: 5,
  },
  userText: {
    fontSize: 16,
    flex: 1, // Chiếm không gian còn lại
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '20%', // Điều chỉnh chiều rộng của nút
  },

});

export default UserManagement;
