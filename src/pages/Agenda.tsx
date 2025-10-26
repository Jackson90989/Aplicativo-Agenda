import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
  Modal,
  ScrollView,
  StatusBar
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { style } from './styles/agenda';
import { themas } from '../global/themes';
import { Appointment, AppointmentType } from '../types/agenda';

// Definir os nomes dos ícones corretamente
type MaterialIconName = 
  | 'person'
  | 'work'
  | 'local-hospital'
  | 'event'
  | 'delete'
  | 'calendar-today'
  | 'access-time'
  | 'event-busy'
  | 'search'
  | 'add'
  | 'close';

export default function Agenda(): React.JSX.Element {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');

  // Estados para novo agendamento
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [type, setType] = useState<AppointmentType>('personal');

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments(): Promise<void> {
    setLoading(true);
    // Simulando carregamento de dados
    setTimeout(() => {
      const mockAppointments: Appointment[] = [
        {
          id: '1',
          title: 'Consulta Médica',
          description: 'Check-up anual com cardiologista',
          date: '2024-01-15',
          time: '14:30',
          type: 'health',
          status: 'pending'
        },
        {
          id: '2',
          title: 'Reunião de Trabalho',
          description: 'Apresentação do projeto novo',
          date: '2024-01-16',
          time: '10:00',
          type: 'work',
          status: 'pending'
        },
        {
          id: '3',
          title: 'Aniversário da Maria',
          description: 'Festa surpresa no jardim',
          date: '2024-01-18',
          time: '19:00',
          type: 'personal',
          status: 'pending'
        }
      ];
      setAppointments(mockAppointments);
      setLoading(false);
    }, 1000);
  }

  async function handleAddAppointment(): Promise<void> {
    try {
      if (!title || !date || !time) {
        return Alert.alert('Atenção', 'Preencha título, data e hora!');
      }

      setLoading(true);

      const newAppointment: Appointment = {
        id: Date.now().toString(),
        title,
        description,
        date,
        time,
        type,
        status: 'pending'
      };

      // Simulando requisição
      setTimeout(() => {
        setAppointments(prev => [newAppointment, ...prev]);
        setLoading(false);
        setModalVisible(false);
        resetForm();
        Alert.alert('Sucesso', 'Agendamento criado com sucesso!');
      }, 1500);
    } catch (error) {
      console.log(error);
      setLoading(false);
      Alert.alert('Erro', 'Não foi possível criar o agendamento');
    }
  }

  function resetForm(): void {
    setTitle('');
    setDescription('');
    setDate('');
    setTime('');
    setType('personal');
  }

  function handleDeleteAppointment(id: string): void {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este agendamento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            setAppointments(prev => prev.filter(item => item.id !== id));
            Alert.alert('Sucesso', 'Agendamento excluído!');
          }
        }
      ]
    );
  }

  function handleToggleStatus(id: string): void {
    setAppointments(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              status: item.status === 'pending' ? 'completed' : 'pending'
            }
          : item
      )
    );
  }

  const filteredAppointments = appointments.filter(appointment =>
    appointment.title.toLowerCase().includes(searchText.toLowerCase()) ||
    appointment.description.toLowerCase().includes(searchText.toLowerCase())
  );

  const getTypeColor = (appointmentType: AppointmentType): string => {
    const colors = {
      personal: themas.colors.primary,
      work: themas.colors.info,
      health: themas.colors.success,
      other: themas.colors.warning
    };
    return colors[appointmentType];
  };

  const getStatusColor = (status: string): string => {
    const colors = {
      pending: themas.colors.warning,
      completed: themas.colors.success,
      cancelled: themas.colors.error
    };
    return colors[status as keyof typeof colors];
  };

  const getTypeIcon = (appointmentType: AppointmentType): MaterialIconName => {
    const icons: Record<AppointmentType, MaterialIconName> = {
      personal: 'person',
      work: 'work',
      health: 'local-hospital',
      other: 'event'
    };
    return icons[appointmentType];
  };

  const renderAppointmentItem = ({ item }: { item: Appointment }): React.JSX.Element => (
    <TouchableOpacity 
      style={style.appointmentCard}
      onPress={() => handleToggleStatus(item.id)}
    >
      <View style={style.appointmentHeader}>
        <View style={[style.typeIndicator, { backgroundColor: getTypeColor(item.type) }]}>
          <MaterialIcons name={getTypeIcon(item.type)} size={16} color="#FFF" />
        </View>
        <Text style={style.appointmentTitle}>{item.title}</Text>
        <TouchableOpacity onPress={() => handleDeleteAppointment(item.id)}>
          <MaterialIcons name="delete" size={20} color={themas.colors.error} />
        </TouchableOpacity>
      </View>

      <Text style={style.appointmentDescription}>{item.description}</Text>
      
      <View style={style.appointmentFooter}>
        <View style={style.timeInfo}>
          <MaterialIcons name="calendar-today" size={14} color={themas.colors.gray} />
          <Text style={style.timeText}>{item.date}</Text>
          <MaterialIcons name="access-time" size={14} color={themas.colors.gray} />
          <Text style={style.timeText}>{item.time}</Text>
        </View>
        
        <View style={[style.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={style.statusText}>
            {item.status === 'pending' ? 'Pendente' : 
             item.status === 'completed' ? 'Concluído' : 'Cancelado'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const typeButtons: { type: AppointmentType; label: string; icon: MaterialIconName }[] = [
    { type: 'personal', label: 'Pessoal', icon: 'person' },
    { type: 'work', label: 'Trabalho', icon: 'work' },
    { type: 'health', label: 'Saúde', icon: 'local-hospital' },
    { type: 'other', label: 'Outro', icon: 'event' }
  ];

  return (
    <View style={style.container}>
      <StatusBar backgroundColor={themas.colors.primary} />
      
      {/* Header */}
      <View style={style.header}>
        <Text style={style.headerTitle}>Minha Agenda</Text>
        <TouchableOpacity 
          style={style.addButton}
          onPress={() => setModalVisible(true)}
        >
          <MaterialIcons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={style.searchContainer}>
        <View style={style.searchBox}>
          <MaterialIcons name="search" size={20} color={themas.colors.gray} />
          <TextInput
            style={style.searchInput}
            placeholder="Buscar agendamentos..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* Appointments List */}
      <View style={style.content}>
        {loading ? (
          <View style={style.loadingContainer}>
            <ActivityIndicator size="large" color={themas.colors.primary} />
            <Text style={style.loadingText}>Carregando agendamentos...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredAppointments}
            renderItem={renderAppointmentItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={style.emptyContainer}>
                <MaterialIcons name="event-busy" size={64} color={themas.colors.gray} />
                <Text style={style.emptyText}>Nenhum agendamento encontrado</Text>
              </View>
            }
          />
        )}
      </View>

      {/* Modal para novo agendamento */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={style.modalContainer}>
          <View style={style.modalContent}>
            <View style={style.modalHeader}>
              <Text style={style.modalTitle}>Novo Agendamento</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color={themas.colors.gray} />
              </TouchableOpacity>
            </View>

            <ScrollView style={style.modalBody}>
              {/* Título */}
              <Text style={style.label}>Título *</Text>
              <View style={style.inputContainer}>
                <TextInput
                  style={style.input}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Digite o título"
                />
              </View>

              {/* Descrição */}
              <Text style={style.label}>Descrição</Text>
              <View style={[style.inputContainer, style.textAreaContainer]}>
                <TextInput
                  style={[style.input, style.textArea]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Digite a descrição"
                  multiline
                  numberOfLines={3}
                />
              </View>

              {/* Data e Hora */}
              <View style={style.row}>
                <View style={style.halfInput}>
                  <Text style={style.label}>Data *</Text>
                  <View style={style.inputContainer}>
                    <TextInput
                      style={style.input}
                      value={date}
                      onChangeText={setDate}
                      placeholder="DD/MM/AAAA"
                    />
                  </View>
                </View>
                
                <View style={style.halfInput}>
                  <Text style={style.label}>Hora *</Text>
                  <View style={style.inputContainer}>
                    <TextInput
                      style={style.input}
                      value={time}
                      onChangeText={setTime}
                      placeholder="HH:MM"
                    />
                  </View>
                </View>
              </View>

              {/* Tipo */}
              <Text style={style.label}>Tipo</Text>
              <View style={style.typeContainer}>
                {typeButtons.map((button) => (
                  <TouchableOpacity
                    key={button.type}
                    style={[
                      style.typeButton,
                      type === button.type && style.typeButtonSelected
                    ]}
                    onPress={() => setType(button.type)}
                  >
                    <MaterialIcons 
                      name={button.icon} 
                      size={16} 
                      color={type === button.type ? '#FFF' : getTypeColor(button.type)} 
                    />
                    <Text style={[
                      style.typeButtonText,
                      type === button.type && style.typeButtonTextSelected
                    ]}>
                      {button.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={style.modalFooter}>
              <TouchableOpacity 
                style={[style.button, style.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={style.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={style.button}
                onPress={handleAddAppointment}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <Text style={style.buttonText}>Salvar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}