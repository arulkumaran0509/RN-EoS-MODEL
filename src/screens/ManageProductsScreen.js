import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { HeaderBar } from '../components/HeaderBar';
import { ImageFallback } from '../components/ImageFallback';
import { AppButton } from '../components/AppButton';
import { COLORS, FONTS, SHADOWS } from '../theme/colors';

export const ManageProductsScreen = ({ navigation }) => {
  const { products, addProduct, updateProduct, deleteProduct, resetProducts } = useShop();
  const { isAdmin, createAdminAccount } = useAuth();

  // Modal State for Add / Edit Product
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);

  // Product Form Fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Fruits');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [formError, setFormError] = useState('');

  // Modal State for Create Admin Account (Restricted to Admins)
  const [adminModalVisible, setAdminModalVisible] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminConfirmPassword, setAdminConfirmPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  // Guard for Customer role
  if (!isAdmin) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <HeaderBar title="Manage Products" showMenu={true} />
        <View style={styles.guardContainer}>
          <Text style={styles.guardEmoji}>🔒</Text>
          <Text style={styles.guardTitle}>Admin Privilege Required</Text>
          <Text style={styles.guardSubtitle}>
            Only Administrator accounts can manage, add, edit, or delete items in the grocery catalog.
          </Text>
          <AppButton
            title="Return to Store"
            variant="primary"
            onPress={() => navigation.navigate('Tabs', { screen: 'Home' })}
            style={styles.guardButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentEditId(null);
    setName('');
    setCategory('Fruits');
    setPrice('');
    setDescription('');
    setImageUrl('');
    setFormError('');
    setModalVisible(true);
  };

  const openEditModal = (product) => {
    setIsEditing(true);
    setCurrentEditId(product.id);
    setName(product.name);
    setCategory(product.category);
    setPrice(String(product.price));
    setDescription(product.description || '');
    setImageUrl(product.imageUrl || '');
    setFormError('');
    setModalVisible(true);
  };

  const handleSaveProduct = () => {
    if (!name.trim()) {
      setFormError('Product name is required.');
      return;
    }
    const numPrice = Number(price);
    if (!price || isNaN(numPrice) || numPrice <= 0) {
      setFormError('Please enter a valid positive price per kg.');
      return;
    }

    if (isEditing && currentEditId) {
      updateProduct(currentEditId, {
        name: name.trim(),
        category,
        price: numPrice,
        description: description.trim(),
        imageUrl: imageUrl.trim() || undefined,
      });
      Alert.alert('Success', 'Product updated successfully.');
    } else {
      addProduct({
        name: name.trim(),
        category,
        price: numPrice,
        description: description.trim(),
        imageUrl: imageUrl.trim() || undefined,
      });
      Alert.alert('Success', 'New grocery product added to catalog.');
    }

    setModalVisible(false);
  };

  const handleDeleteProduct = (product) => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete ${product.name} from the store catalog?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteProduct(product.id),
        },
      ]
    );
  };

  const handleResetCatalog = () => {
    Alert.alert(
      'Reset Catalog',
      'Reset the product catalog back to the initial 9 items with assignment prices?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: resetProducts,
        },
      ]
    );
  };

  const openAdminModal = () => {
    setAdminName('');
    setAdminEmail('');
    setAdminPhone('');
    setAdminPassword('');
    setAdminConfirmPassword('');
    setAdminError('');
    setAdminModalVisible(true);
  };

  const handleCreateAdmin = () => {
    setAdminError('');
    const result = createAdminAccount({
      fullName: adminName,
      email: adminEmail,
      phone: adminPhone,
      password: adminPassword,
      confirmPassword: adminConfirmPassword,
    });

    if (!result.success) {
      setAdminError(result.error);
      return;
    }

    Alert.alert(
      'Admin Account Created',
      `Administrator account for ${result.user.fullName} (${result.user.email}) has been successfully created. They can now log in using the Admin portal.`
    );
    setAdminModalVisible(false);
  };

  const renderProductItem = ({ item }) => (
    <View style={styles.productRow}>
      <View style={styles.thumbWrapper}>
        <ImageFallback
          source={{ uri: item.imageUrl }}
          fallbackEmoji={item.fallbackEmoji}
          style={styles.thumb}
        />
      </View>

      <View style={styles.productInfo}>
        <View style={styles.nameCategoryRow}>
          <Text style={styles.productName}>{item.name}</Text>
          <View
            style={[
              styles.categoryTag,
              {
                backgroundColor:
                  item.category === 'Fruits' ? COLORS.fruitBadge : COLORS.vegBadge,
              },
            ]}
          >
            <Text
              style={[
                styles.categoryTagText,
                {
                  color:
                    item.category === 'Fruits'
                      ? COLORS.fruitBadgeText
                      : COLORS.vegBadgeText,
                },
              ]}
            >
              {item.category}
            </Text>
          </View>
        </View>

        <Text style={styles.priceText}>
          ₹{item.price} <Text style={styles.unitText}>/ {item.unit || 'kg'}</Text>
        </Text>
      </View>

      {/* Admin Quick Action Buttons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => openEditModal(item)}
          style={[styles.actionBtn, styles.editBtn]}
        >
          <Ionicons name="create-outline" size={18} color={COLORS.darkGreen} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handleDeleteProduct(item)}
          style={[styles.actionBtn, styles.deleteBtn]}
        >
          <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[COLORS.paleMint, COLORS.cream]}
        style={styles.gradient}
      >
        {/* Header Bar */}
        <HeaderBar
          title="Manage Products"
          subtitle={`Admin Console (${products.length} Products)`}
          showMenu={true}
        />

        {/* Admin Controls Ribbon */}
        <View style={styles.controlsRibbon}>
          <AppButton
            title="Add Product"
            icon="add-circle"
            variant="primary"
            size="small"
            onPress={openAddModal}
            style={styles.addBtn}
          />

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={openAdminModal}
            style={styles.createAdminBtn}
          >
            <Ionicons name="person-add" size={15} color={COLORS.darkGreen} />
            <Text style={styles.createAdminBtnText}>+ Admin</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleResetCatalog} style={styles.resetBtn}>
            <Ionicons name="refresh" size={15} color={COLORS.textSecondary} />
            <Text style={styles.resetBtnText}>Reset</Text>
          </TouchableOpacity>
        </View>

        {/* Product List */}
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderProductItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        {/* Modal for Add / Edit Product */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {isEditing ? 'Edit Grocery Product' : 'Add New Grocery Product'}
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {formError ? (
                  <View style={styles.modalErrorBox}>
                    <Text style={styles.modalErrorText}>{formError}</Text>
                  </View>
                ) : null}

                {/* Name */}
                <Text style={styles.fieldLabel}>Product Name *</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Fresh Mango"
                  placeholderTextColor={COLORS.sage}
                  style={styles.modalInput}
                />

                {/* Category Selector */}
                <Text style={styles.fieldLabel}>Category *</Text>
                <View style={styles.modalCategoryRow}>
                  {['Fruits', 'Vegetables'].map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => setCategory(cat)}
                      style={[
                        styles.modalCatPill,
                        category === cat && styles.modalCatPillActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.modalCatText,
                          category === cat && styles.modalCatTextActive,
                        ]}
                      >
                        {cat === 'Fruits' ? '🍎 Fruits' : '🥦 Vegetables'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Price */}
                <Text style={styles.fieldLabel}>Price Per Kilogram (₹) *</Text>
                <TextInput
                  value={price}
                  onChangeText={setPrice}
                  placeholder="e.g. 150"
                  placeholderTextColor={COLORS.sage}
                  keyboardType="numeric"
                  style={styles.modalInput}
                />

                {/* Image URL */}
                <Text style={styles.fieldLabel}>Image URL (Optional)</Text>
                <TextInput
                  value={imageUrl}
                  onChangeText={setImageUrl}
                  placeholder="https://images.unsplash.com/..."
                  placeholderTextColor={COLORS.sage}
                  style={styles.modalInput}
                />

                {/* Description */}
                <Text style={styles.fieldLabel}>Product Description</Text>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Organic, fresh, farm source details..."
                  placeholderTextColor={COLORS.sage}
                  multiline
                  numberOfLines={3}
                  style={[styles.modalInput, styles.modalTextArea]}
                />

                <View style={styles.modalButtonsRow}>
                  <AppButton
                    title="Cancel"
                    variant="outline"
                    onPress={() => setModalVisible(false)}
                    style={styles.modalCancelBtn}
                  />
                  <AppButton
                    title={isEditing ? 'Save Changes' : 'Create Product'}
                    variant="primary"
                    onPress={handleSaveProduct}
                    style={styles.modalSaveBtn}
                  />
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Modal for Create Admin Account (Restricted to authenticated Admins) */}
        <Modal
          visible={adminModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setAdminModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View style={styles.adminModalTitleRow}>
                  <Ionicons name="shield-checkmark" size={22} color={COLORS.darkGreen} />
                  <Text style={styles.modalTitle}>Create Admin Account</Text>
                </View>
                <TouchableOpacity onPress={() => setAdminModalVisible(false)}>
                  <Ionicons name="close" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.adminNoticeBox}>
                  <Ionicons name="lock-closed" size={14} color={COLORS.darkGreen} />
                  <Text style={styles.adminNoticeText}>
                    Authorized Admin Action: Create administrative credentials for store management and inventory controls.
                  </Text>
                </View>

                {adminError ? (
                  <View style={styles.modalErrorBox}>
                    <Text style={styles.modalErrorText}>{adminError}</Text>
                  </View>
                ) : null}

                <Text style={styles.fieldLabel}>Admin Full Name *</Text>
                <TextInput
                  value={adminName}
                  onChangeText={setAdminName}
                  placeholder="e.g. Rajesh Kumar"
                  placeholderTextColor={COLORS.sage}
                  style={styles.modalInput}
                />

                <Text style={styles.fieldLabel}>Admin Email Address *</Text>
                <TextInput
                  value={adminEmail}
                  onChangeText={setAdminEmail}
                  placeholder="e.g. rajesh.admin@grocery.com"
                  placeholderTextColor={COLORS.sage}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.modalInput}
                />

                <Text style={styles.fieldLabel}>Phone Number *</Text>
                <TextInput
                  value={adminPhone}
                  onChangeText={setAdminPhone}
                  placeholder="e.g. 9876500000"
                  placeholderTextColor={COLORS.sage}
                  keyboardType="phone-pad"
                  style={styles.modalInput}
                />

                <Text style={styles.fieldLabel}>Password *</Text>
                <TextInput
                  value={adminPassword}
                  onChangeText={setAdminPassword}
                  placeholder="At least 6 characters"
                  placeholderTextColor={COLORS.sage}
                  secureTextEntry
                  style={styles.modalInput}
                />

                <Text style={styles.fieldLabel}>Confirm Password *</Text>
                <TextInput
                  value={adminConfirmPassword}
                  onChangeText={setAdminConfirmPassword}
                  placeholder="Re-enter password"
                  placeholderTextColor={COLORS.sage}
                  secureTextEntry
                  style={styles.modalInput}
                />

                <View style={styles.modalButtonsRow}>
                  <AppButton
                    title="Cancel"
                    variant="outline"
                    onPress={() => setAdminModalVisible(false)}
                    style={styles.modalCancelBtn}
                  />
                  <AppButton
                    title="Create Admin"
                    variant="primary"
                    onPress={handleCreateAdmin}
                    style={styles.modalSaveBtn}
                  />
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.paleMint,
  },
  gradient: {
    flex: 1,
  },
  controlsRibbon: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  addBtn: {
    flex: 1.3,
  },
  createAdminBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.softPistachio,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 20,
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.pistachio,
  },
  createAdminBtnText: {
    fontSize: 12,
    color: COLORS.darkGreen,
    fontWeight: FONTS.bold,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cream,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 20,
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  resetBtnText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: FONTS.medium,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cream,
    borderRadius: 18,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  thumbWrapper: {
    width: 60,
    height: 60,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.paleMint,
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  nameCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  productName: {
    fontSize: 15,
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary,
  },
  categoryTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryTagText: {
    fontSize: 10,
    fontWeight: FONTS.bold,
  },
  priceText: {
    fontSize: 15,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
  },
  unitText: {
    fontSize: 12,
    fontWeight: FONTS.medium,
    color: COLORS.textSecondary,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtn: {
    backgroundColor: COLORS.softPistachio,
  },
  deleteBtn: {
    backgroundColor: '#FFEBEE',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(38, 53, 40, 0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.cream,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  adminModalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
  },
  adminNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.softPistachio,
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
  },
  adminNoticeText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.darkGreen,
    fontWeight: FONTS.medium,
    lineHeight: 16,
  },
  modalErrorBox: {
    backgroundColor: '#FFEBEE',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  modalErrorText: {
    color: COLORS.error,
    fontSize: 12,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: FONTS.semiBold,
    color: COLORS.darkGreen,
    marginBottom: 6,
    marginTop: 8,
  },
  modalInput: {
    backgroundColor: COLORS.paleMint,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  modalTextArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalCategoryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 6,
  },
  modalCatPill: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.paleMint,
  },
  modalCatPillActive: {
    backgroundColor: COLORS.pistachio,
    borderColor: COLORS.pistachio,
  },
  modalCatText: {
    fontSize: 13,
    fontWeight: FONTS.semiBold,
    color: COLORS.textSecondary,
  },
  modalCatTextActive: {
    color: COLORS.darkGreen,
    fontWeight: FONTS.bold,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    marginBottom: 10,
  },
  modalCancelBtn: {
    flex: 1,
  },
  modalSaveBtn: {
    flex: 1.4,
  },
  guardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  guardEmoji: {
    fontSize: 48,
    marginBottom: 14,
  },
  guardTitle: {
    fontSize: 20,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
    marginBottom: 8,
  },
  guardSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  guardButton: {
    minWidth: 220,
  },
});
