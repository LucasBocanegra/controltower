import html from 'choo/html';
import toolbar from './toolbar';

export default (state, prev, send) => html`
<div>
    ${toolbar(state.user, send)}
    <h1>Welcome</h1>
    ${state.user.id ? JSON.stringify(state.user) : ''}
</div>`;
