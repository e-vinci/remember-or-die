/* eslint-disable no-use-before-define */
/* eslint-disable no-console */
import { getAuthenticatedUser } from '../../utils/auths';
import makeDisappearNavbar from '../../utils/navbarSetup';
import { clearPage } from '../../utils/render';
import Navigate from '../Router/Navigate';

let thisPlayer = null;
let playerId = null;

const AlliesPage = async () => {
  thisPlayer = getAuthenticatedUser();

  if (!thisPlayer) {
    Navigate('/login');
    return;
  }

  playerId = thisPlayer.playerId;
  

  makeDisappearNavbar(false);

  clearPage();

  const main = document.querySelector('main');
  const title = document.createElement('h1');
  title.innerText = 'Alliés du Royaume';

  const container = document.createElement('div');
  container.classList.add('container');

  const alliesTable = await createAlliesTable();
  container.appendChild(alliesTable);

  const buttonsContainer = document.createElement('div');
  buttonsContainer.classList.add('d-flex', 'justify-content-center', 'my-4');

  const buttonsGroup = document.createElement('div');
  buttonsGroup.classList.add('btn-group');

  const alliesButton = document.createElement('button');
  alliesButton.textContent = 'Mes Alliés';
  alliesButton.type = 'button';
  alliesButton.classList.add('btn', 'btn-secondary', 'active');
  buttonsGroup.appendChild(alliesButton);

  const invitationsButton = document.createElement('button');
  invitationsButton.textContent = 'Invitations';
  invitationsButton.type = 'button';
  invitationsButton.classList.add('btn', 'btn-secondary');
  buttonsGroup.appendChild(invitationsButton);

  const addAllyButton = document.createElement('button');
  addAllyButton.textContent = 'Ajouter un Allié';
  addAllyButton.type = 'button';
  addAllyButton.classList.add('btn', 'btn-secondary');
  buttonsGroup.appendChild(addAllyButton);

  buttonsContainer.appendChild(buttonsGroup);

  const toggleActive = (selectedButton) => {
    [alliesButton, invitationsButton, addAllyButton].forEach((button) => {
      if (button === selectedButton) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  };

  toggleActive(alliesButton);

  alliesButton.addEventListener('click', async () => {
    container.innerHTML = '';
    const alliancesTable = await createAlliesTable();
    container.appendChild(alliancesTable);
    toggleActive(alliesButton);
  });

  invitationsButton.addEventListener('click', async () => {
    container.innerHTML = '';
    const invitationsTable = await createInvitationsTable();
    container.appendChild(invitationsTable);
    toggleActive(invitationsButton);
  });

  addAllyButton.addEventListener('click', () => {
    container.innerHTML = '';

    const allyForm = document.createElement('form');
    allyForm.classList.add('needs-validation', 'd-flex', 'flex-column', 'align-items-center');
    allyForm.style.marginTop = '20px';

    const nameLabel = document.createElement('label');
    nameLabel.textContent = "Nom de l'allié :";
    allyForm.appendChild(nameLabel);

    const nameInput = document.createElement('input');
    nameInput.setAttribute('type', 'text');
    nameInput.setAttribute('required', 'true');
    nameInput.setAttribute('name', 'allyToBeAdded');
    nameInput.classList.add('form-control');
    nameInput.style.maxWidth = '50%';
    nameInput.style.fontSize = 'x-large';
    nameInput.style.marginBottom = '20px';
    allyForm.appendChild(nameInput);

    const addButton = document.createElement('button');
    addButton.setAttribute('type', 'submit');
    addButton.classList.add('btn', 'btn-warning', 'btn-block');
    addButton.textContent = 'Ajouter';
    allyForm.appendChild(addButton);

    const formMessage = document.createElement('div');
    formMessage.classList.add('mt-3', 'text-center');

    allyForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const allyToBeAdded = nameInput.value;
      if (allyForm.checkValidity()) {
        try {
          const response = await fetch(`${process.env.API_BASE_URL}/alliances/${playerId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ allyToBeAdded }),
          });

          const data = await response.json();

          if (response.ok) {
            formMessage.innerText = data.message;
            formMessage.classList.remove('text-danger');
            formMessage.classList.add('text-success');
          } else {
            formMessage.innerText = data.error;
            formMessage.classList.remove('text-success');
            formMessage.classList.add('text-danger');
          }
        } catch (error) {
          formMessage.innerText = error.message;
          formMessage.classList.remove('text-success');
          formMessage.classList.add('text-danger');
        }
        allyForm.appendChild(formMessage);
      } else {
        event.stopPropagation();
      }
    });

    container.appendChild(allyForm);
    toggleActive(addAllyButton);
  });

  main.appendChild(title);
  main.appendChild(buttonsContainer);
  main.appendChild(container);
};

const fetchInvitations = async () => {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/alliances/invitations/${playerId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des invitations: ', error);
    return [];
  }
};

const fetchAllies = async () => {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/alliances/allies/${playerId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des alliés: ', error);
    return [];
  }
};

const acceptInvitation = async (sender) => {
  try {
    await fetch(`${process.env.API_BASE_URL}/alliances/${playerId}/${sender}?action=accept`, {
      method: 'PUT',
    });
    fetchAllies();
    fetchInvitations();
  } catch (error) {
    console.error("Erreur lors de l'acceptation de l'invitation: ", error);
  }
};

const rejectInvitation = async (sender) => {
  try {
    await fetch(`${process.env.API_BASE_URL}/alliances/${playerId}/${sender}?action=reject`, {
      method: 'PUT',
    });
    fetchInvitations();
  } catch (error) {
    console.error("Erreur lors du rejet de l'invitation: ", error);
  }
};

const removeAlly = async (ally) => {
  try {
    await fetch(`${process.env.API_BASE_URL}/alliances/${playerId}/${ally}`, {
      method: 'DELETE',
    });
    fetchAllies();
  } catch (error) {
    console.error("Erreur lors de la suppression de l'allié: ", error);
  }
};

const createInvitationsTable = async () => {
  const invitations = await fetchInvitations();

  const table = document.createElement('table');
  table.classList.add('table', 'general-table');

  const tableHead = document.createElement('thead');
  tableHead.innerHTML = `
    <tr>
      <th scope="col">Invitation de</th>
      <th scope="col">Action</th>
    </tr>
  `;
  table.appendChild(tableHead);

  const tableBody = document.createElement('tbody');

  if (invitations.length === 0) {
    const noInvitationsRow = document.createElement('tr');
    noInvitationsRow.innerHTML = `
      <td colspan="2">Pas d'invitations pour le moment...</td>
    `;
    tableBody.appendChild(noInvitationsRow);
  } else {
    invitations.forEach((invitation) => {
      const inviteRow = document.createElement('tr');
      inviteRow.innerHTML = `
        <td>${invitation.login}</td>
        <td>
          <button class="btn btn-primary accept-btn ${
            invitation.state === 'accepted' ? 'disabled' : ''
          }" ${invitation.state === 'accepted' ? 'disabled' : ''}>
            ${invitation.state === 'accepted' ? 'Acceptée' : 'Accepter'}
          </button>
          <button class="btn btn-danger reject-btn">Rejeter</button>
        </td>
      `;

      const acceptButton = inviteRow.querySelector('.accept-btn');
      const rejectButton = inviteRow.querySelector('.reject-btn');

      if (invitation.state !== 'accepted') {
        acceptButton.addEventListener('click', () => {
          acceptInvitation(invitation.login);
          acceptButton.classList.add('btn-secondary', 'disabled');
          acceptButton.textContent = 'Acceptée';
          acceptButton.disabled = true;
          rejectButton.disabled = true;
        });
        rejectButton.addEventListener('click', () => {
          rejectInvitation(invitation.login);
          rejectButton.classList.add('disabled');
          rejectButton.textContent = 'Rejetée';
          rejectButton.disabled = true;
          acceptButton.disabled = true;
        });
      }

      tableBody.appendChild(inviteRow);
    });
  }

  table.appendChild(tableBody);

  return table;
};

const createAlliesTable = async () => {
  const allies = await fetchAllies();

  const table = document.createElement('table');
  table.classList.add('table', 'general-table');

  const tableHead = document.createElement('thead');
  tableHead.innerHTML = `
    <tr>
      <th scope="col">Allié</th>
      <th scope="col">Action</th>
    </tr>
  `;
  table.appendChild(tableHead);

  const tableBody = document.createElement('tbody');

  if (allies.length === 0) {
    const noAlliesRow = document.createElement('tr');
    noAlliesRow.innerHTML = `
      <td colspan="2">Pas d'alliés pour le moment...</td>
    `;
    tableBody.appendChild(noAlliesRow);
  } else {
    allies.forEach((ally) => {
      const allyRow = document.createElement('tr');
      allyRow.innerHTML = `
        <td>${ally.login}</td>
        <td>
          <button class="btn btn-danger btn-sm">Supprimer</button>
        </td>
      `;

      const deleteButton = allyRow.querySelector('button');
      deleteButton.addEventListener('click', async () => {
        await removeAlly(ally.login);
        allyRow.remove();
        const updatedAllies = await fetchAllies();
        if (updatedAllies.length === 0) {
          tableBody.innerHTML = '';
          const noAlliesRow = document.createElement('tr');
          noAlliesRow.innerHTML = `
            <td colspan="2">Pas d'alliés pour le moment...</td>
          `;
          tableBody.appendChild(noAlliesRow);
        }
      });

      tableBody.appendChild(allyRow);
    });
  }

  table.appendChild(tableBody);

  return table;
};

export default AlliesPage;
