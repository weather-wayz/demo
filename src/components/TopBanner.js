import React from 'react';
import styled from 'styled-components/native';
import { withNavigation } from 'react-navigation';
import TopLeftMenu from '../components/TopLeftMenu';
import TopLocationMenu from '../components/TopLocationMenu';
import { COLORS } from '../constant/color';

/* 
Top banner Component 
show on top of screen
*/

class TopBanner extends React.Component {
	// set up state
	constructor(props) {
		super(props);
		this.state = {
			userIcon: '',
			topLeftMenuVisible: false,
			topLocationMenuVisible: false,
		};
	}

	// rerender top banner when navigating between bottom tap bar 
	componentDidMount() {
		this._navListener = this.props.navigation.addListener('didFocus', () => {
			this.setState({
				topLeftMenuVisible: false,
			    topLocationMenuVisible: false,
			});
		});
	}

	//rendering
	render(){
		return(
			<Container>
				<MenuButton onPress={() => { this.setState({ topLeftMenuVisible: !this.state.topLeftMenuVisible, }); }}>
					<MenuButtonIcon source={require('../../assets/icon/function-icon/menu.png')} />
				</MenuButton>
				<BannerText> {this.props.pageType} </BannerText>
				<UserButton>
					{/* 
					make API call to rethinkDB to get real user icon picture, then set the user icon url as this.state.userID
					replace require('../../assets/icon/role-icon/pikachu.png') with { uri: this.state.userIcon } after setting up state
					*/}
				    <UserButtonIcon source={require('../../assets/icon/role-icon/pikachu.png')} />
				</UserButton>
				<RefreshButton>
				    <RefreshButtonIcon source={require('../../assets/icon/function-icon/refresh.png')} />
				</RefreshButton>
				<LocationButton onPress={() => { this.setState({ topLocationMenuVisible: !this.state.topLocationMenuVisible, }); }}>
				    <LocationButtonIcon source={require('../../assets/icon/function-icon/location-pin.png')} />
				</LocationButton>
				{/* put components with absolute position at the bottom */}
				{this.state.topLeftMenuVisible && <TopLeftMenu />}
			    {this.state.topLocationMenuVisible && <TopLocationMenu />}
			</Container>
		);
	}
}

export default withNavigation(TopBanner);

// css
const Container = styled.View`
    height: 40px;
	width: 375px;
	position: absolute;
	top: 20px;
	left: 0px;
	background-color: whitesmoke;
	flex-direction: row;
	zIndex: 0;
`;

const MenuButton = styled.TouchableOpacity`
	flex: 2;
	align-items: center;
	padding-top: 10px;
`;

const MenuButtonIcon = styled.Image`
	width: 37.5px;
	height: 25px;
	resize-mode: stretch;
	margin-left: 2.5px;
`;

const BannerText = styled.Text`
	flex: 5;
	font-family: Gill Sans;
	font-size: 17.5px;
	padding-top: 12.5px;
`;

const RefreshButton = styled.TouchableOpacity`
    flex: 2;
    align-items: center;
    padding-top: 10px;
`;

const RefreshButtonIcon = styled.Image`
	width: 25px;
	height: 25px;
	resize-mode: stretch;
`;

const UserButton = styled.TouchableOpacity`
	flex: 2;
	align-items: center;
	padding-top: 7.5px;
`;

const UserButtonIcon = styled.Image`
	width: 30px;
	height: 30px;
	border-radius: 17.5px;
	resize-mode: stretch;
`;

const LocationButton = styled.TouchableOpacity`
    flex: 2;
    align-items: center;
	padding-top: 7.5px;
`;

const LocationButtonIcon = styled.Image`
	width: 35px;																																					px;
	height: 30px;
	resize-mode: stretch;
`;