import { v4 as uuidv4 } from 'uuid';

const getUUId = () => {
  return uuidv4().replace(/-/g, '');
};

export default getUUId;
