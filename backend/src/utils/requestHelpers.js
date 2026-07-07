const createRequestCode = () => `REQ-${Date.now().toString(36).toUpperCase()}`;

const buildStatusHistoryEntry = ({ status, note, userId }) => ({
  status,
  note: note || '',
  updatedBy: userId || null,
  updatedAt: new Date()
});

module.exports = {
  createRequestCode,
  buildStatusHistoryEntry
};
