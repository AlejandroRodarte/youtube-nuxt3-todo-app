import { H3WithUserContext } from '../../../lib/interfaces/h3/h3-with-user-context.inteface';

const checkUserContext = async (event: H3WithUserContext): Promise<void> => {
  if (!event.context.user) return sendRedirect(event, '/auth');
};

export default checkUserContext;
