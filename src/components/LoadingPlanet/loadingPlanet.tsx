import styles from './loadingPlanet.module.css';
import Image from 'next/image';

const LoadingPlanet = () => { //load page burning nft component
    return (
        <div className={styles.planetGifContainer}>
            <Image
            src='/static/images/planet_gif2.gif'
            width={600}
            height={600}
            alt='loading gif'
            className={styles.planetGif}
            unoptimized={true}
            />
        </div>
    );
};

export default LoadingPlanet;