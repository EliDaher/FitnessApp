import { View, Text, TextInput, Platform, KeyboardAvoidingView, ScrollView, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useTailwind } from '../hooks/useTailwind';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { updatePersonalDetails } from '../apis/user.api';

type userType = {
  email: string,
  fullname: string,
  gender: string,
  height: number,
  password: string,
  username: string,
  weight: number,
  address: string,
  date: Date,
  job: string,
  bloodType: string,
  healthConditions: string,
  
}

export default function PersonalDetails({ userData }: { userData: userType | null }) {

  const tw = useTailwind();

  // States
  const [username, setUsername] = useState<string | undefined>('');
  const [address, setAddress] = useState<string | undefined>('');
  const [job, setJob] = useState<string | undefined>('');
  const [bloodType, setBloodType] = useState<string | undefined>('');
  const [healthConditions, setHealthConditions] = useState<string | undefined>('');
  const [date, setDate] = useState<Date>(new Date());
  const [show, setShow] = useState<boolean>(false);
  const [loading, setLoading] = useState(false)

  // Validation states
  const [isValidAge, setIsValidAge] = useState<boolean>(true);

  // Handle date change
  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShow(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  // حساب العمر
  const calculateAge = (birthDate: Date): number => {
    if(!birthDate) { return 0}
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const hasHadBirthdayThisYear =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
    if (!hasHadBirthdayThisYear) age--;
    return age;
  };

  // تحقق من العمر
  useEffect(() => {
    const age = calculateAge(date);
    if (age < 8) {
      setIsValidAge(false);
    } else {
      setIsValidAge(true);
    }
  }, [date]);

  //اضافة بيانات المستخدم اذا موجود
  useEffect(() => {
    if (userData) {

      setUsername(userData.username || '');
      setAddress(userData.address || '');
      setJob(userData.job || '');
      setBloodType(userData.bloodType || '');
      setHealthConditions(userData.healthConditions || '');
  
      // تحقق من أن التاريخ موجود وصالح
      if (userData.date) {
        setDate(new Date(userData.date));
      }
    }
  }, [userData]);

  // handle form submission
  const handleSubmit = async () => {
    const age = calculateAge(date);
    if (!isValidAge || !username || !address || !job) {
      Alert.alert("يرجى التحقق من البيانات المدخلة!");
    } else {
      const res = await updatePersonalDetails(username, address, job, date, bloodType || '', healthConditions || '')
      Alert.alert("تم حفظ البيانات بنجاح!");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={100}
    >
      <ScrollView contentContainerStyle={tw`px-2 pb-20`}>
        {/* Username */}
        <View style={tw`my-2`}>
          <Text style={tw`text-white mb-1 ml-auto mr-3`}>اسم المستخدم</Text>
          <TextInput
            placeholder="الرجاء ادخل اسم المستخدم"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
            style={[
              tw`bg-white/10 text-white px-4 py-3 rounded-xl border`,
              { borderColor: username ? 'green' : 'red' }
            ]}
          />
        </View>

        {/* Address */}
        <View style={tw`my-2`}>
          <Text style={tw`text-white mb-1 ml-auto mr-3`}>العنوان</Text>
          <TextInput
            placeholder="الرجاء ادخل عنوان سكنك"
            placeholderTextColor="#999"
            value={address}
            onChangeText={setAddress}
            style={[
              tw`bg-white/10 text-white px-4 py-3 rounded-xl border`,
              { borderColor: address ? 'green' : 'red' }
            ]}
          />
        </View>

        {/* Date of Birth */}
        <View style={tw`my-2`}>
          <Text style={tw`text-white mb-1 ml-auto mr-3`}>المواليد</Text>
          <Text
            onPress={() => setShow(true)}
            style={[
              tw`bg-white/10 text-white px-4 py-3 rounded-xl border`,
              { borderColor: calculateAge(date) > 8 ? 'green' : 'red' }
            ]}
          >
            {date.toLocaleDateString()}
          </Text>
          <Text style={tw`text-white text-right mr-3 mt-1`}>
            العمر: {calculateAge(date)} سنة
          </Text>
          {show && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChange}
            />
          )}
        </View>

        {/* Job */}
        <View style={tw`my-2`}>
          <Text style={tw`text-white mb-1 ml-auto mr-3`}>الوظيفة</Text>
          <TextInput
            placeholder="الرجاء ادخل وظيفتك"
            placeholderTextColor="#999"
            value={job}
            onChangeText={setJob}
            style={[
              tw`bg-white/10 text-white px-4 py-3 rounded-xl border`,
              { borderColor: job ? 'green' : 'red' }
            ]}
          />
        </View>

        {/* Blood Type */}
        <View style={tw`my-2`}>
          <Text style={tw`text-white mb-1 ml-auto mr-3`}>زمرة الدم</Text>
          <TextInput
            placeholder="الرجاء ادخل زمرة الدم"
            placeholderTextColor="#999"
            value={bloodType}
            onChangeText={setBloodType}
            style={[
              tw`bg-white/10 text-white px-4 py-3 rounded-xl border`,
            ]}
          />
        </View>

        {/* Health Conditions */}
        <View style={tw`my-2`}>
          <Text style={tw`text-white mb-1 ml-auto mr-3`}>الأمراض الخاصة</Text>
          <TextInput
            placeholder="الرجاء ادخال الأمراض الخاصة"
            placeholderTextColor="#999"
            value={healthConditions}
            onChangeText={setHealthConditions}
            style={[
              tw`bg-white/10 text-white px-4 py-3 rounded-xl border`,
            ]}
          />
        </View>

        {/* Submit Button */}
        <View style={tw`mt-4`}>
          <Text
            onPress={handleSubmit}
            style={tw`bg-secondary-500 text-white py-3 rounded-xl text-center`}
          >
            حفظ البيانات
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
