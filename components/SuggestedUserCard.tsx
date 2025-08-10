import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type SuggestedUserProps = {
  username: string;
  name?: string | null;
  onFollow?: () => void;
  onUnfollow?: () => void;
  following?: boolean;
  loading?: boolean;
};

const SuggestedUserCard: React.FC<SuggestedUserProps> = ({ username, name, onFollow, onUnfollow, following, loading }) => {
  const isDisabled = !!loading; // allow pressing when following to unfollow
  const handlePress = () => {
    if (loading) return;
    if (following) onUnfollow?.(); else onFollow?.();
  };
  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{name || username}</Text>
        <Text style={styles.handle}>@{username}</Text>
      </View>
      <TouchableOpacity
        style={[styles.btn, following ? styles.btnFollowing : null, loading ? styles.btnLoading : null]}
        onPress={handlePress}
        disabled={isDisabled}
      >
        <Text style={[styles.btnText, following ? styles.btnTextFollowing : null]}>
          {loading ? '...' : following ? 'Following' : 'Follow'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    color: '#fff',
    fontWeight: '600',
  },
  handle: {
    color: '#94a3b8',
    fontSize: 12,
  },
  btn: {
    backgroundColor: '#374151',
    borderRadius: 9999,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  btnLoading: {
    opacity: 0.7,
  },
  btnFollowing: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#374151',
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  btnTextFollowing: {
    color: '#9ca3af',
  },
});

export default SuggestedUserCard;
