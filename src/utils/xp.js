import { getAuthenticatedUser } from './auths';


let player = null;
let xp = null;

function calculateRank() {
  player  = getAuthenticatedUser();
  if(player === null){
    return null;
  }
    xp = player.xp;
    const currentLevel = Math.floor(Math.sqrt(xp / 10));
    const nextLevelPoints = (currentLevel + 1) ** 2 * 10;
    const progressToNextLevel =
      ((xp - currentLevel ** 2 * 10) / (nextLevelPoints - currentLevel ** 2 * 10)) * 100;
  
    return {
      level: currentLevel,
      progressPercentage: Math.floor(progressToNextLevel),
    };
  
}

export default calculateRank ;
