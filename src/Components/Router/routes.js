import HomePage from '../Pages/HomePage';
import LoginPage from '../Pages/LoginPage';
import RegisterPage from '../Pages/RegisterPage';
import GamePage from '../Pages/GamePage';
import RulesPage from '../Pages/RulesPage';
import CreditsPage from '../Pages/CreditsPage';
import PlayPage from '../Pages/PlayPage';
import WorldPage from '../Pages/WorldPage';
import LeaderboardPage from '../Pages/LeaderboardPage';
import AlliesPage from '../Pages/AlliesPage';
import ProfilePage from '../Pages/ProfilePage';
import LevelsPage from '../Pages/LevelsPage';
import ModifyProfilePage from '../Pages/ModifyProfilePage';
import ModifyAvatarPage from '../Pages/ModifyAvatar';

const routes = {
  '/': HomePage,
  '/login': LoginPage,
  '/register': RegisterPage,
  '/game': GamePage,
  '/rules': RulesPage,
  '/credits': CreditsPage,
  '/play': PlayPage,
  '/worlds': WorldPage,
  '/leaderboard': LeaderboardPage,
  '/allies': AlliesPage,
  '/profile': ProfilePage,
  '/levels': LevelsPage,
  '/modifyProfile': ModifyProfilePage,
  '/modifyAvatar': ModifyAvatarPage,
};

export default routes;
