const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MockERC20 测试", function () {
  let mockToken;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // 获取测试账户
    [owner, addr1, addr2] = await ethers.getSigners();

    // 部署合约
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockToken = await MockERC20.deploy();
    await mockToken.waitForDeployment();
  });

  describe("部署", function () {
    it("应该正确设置代币名称和符号", async function () {
      expect(await mockToken.name()).to.equal("Mock USD");
      expect(await mockToken.symbol()).to.equal("cUSD");
    });

    it("应该正确设置小数位数", async function () {
      expect(await mockToken.decimals()).to.equal(18);
    });

    it("应该给部署者铸造初始供应量", async function () {
      const ownerBalance = await mockToken.balanceOf(owner.address);
      expect(await mockToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("交易", function () {
    it("应该能够在账户之间转账", async function () {
      // 转账 50 tokens 从 owner 到 addr1
      await mockToken.transfer(addr1.address, ethers.parseEther("50"));
      const addr1Balance = await mockToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(ethers.parseEther("50"));

      // 从 addr1 转账 50 tokens 到 addr2
      await mockToken.connect(addr1).transfer(addr2.address, ethers.parseEther("50"));
      const addr2Balance = await mockToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(ethers.parseEther("50"));
    });

    it("应该在余额不足时失败", async function () {
      const initialOwnerBalance = await mockToken.balanceOf(owner.address);

      // 尝试从 addr1 (余额为 0) 转账 1 token 到 owner
      await expect(
        mockToken.connect(addr1).transfer(owner.address, ethers.parseEther("1"))
      ).to.be.reverted;

      // Owner 余额不应该改变
      expect(await mockToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("应该更新转账后的余额", async function () {
      const initialOwnerBalance = await mockToken.balanceOf(owner.address);

      // 转账 100 tokens 从 owner 到 addr1
      await mockToken.transfer(addr1.address, ethers.parseEther("100"));

      // 转账 50 tokens 从 owner 到 addr2
      await mockToken.transfer(addr2.address, ethers.parseEther("50"));

      // 检查余额
      const finalOwnerBalance = await mockToken.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(
        initialOwnerBalance - ethers.parseEther("150")
      );

      const addr1Balance = await mockToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(ethers.parseEther("100"));

      const addr2Balance = await mockToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(ethers.parseEther("50"));
    });
  });

  describe("授权", function () {
    it("应该能够授权其他地址使用代币", async function () {
      await mockToken.approve(addr1.address, ethers.parseEther("100"));
      const allowance = await mockToken.allowance(owner.address, addr1.address);
      expect(allowance).to.equal(ethers.parseEther("100"));
    });

    it("应该能够使用授权额度转账", async function () {
      // Owner 授权 addr1 使用 100 tokens
      await mockToken.approve(addr1.address, ethers.parseEther("100"));

      // addr1 从 owner 转账 50 tokens 到 addr2
      await mockToken.connect(addr1).transferFrom(
        owner.address,
        addr2.address,
        ethers.parseEther("50")
      );

      // 检查余额
      const addr2Balance = await mockToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(ethers.parseEther("50"));

      // 检查剩余授权额度
      const allowance = await mockToken.allowance(owner.address, addr1.address);
      expect(allowance).to.equal(ethers.parseEther("50"));
    });

    it("应该在超过授权额度时失败", async function () {
      // Owner 授权 addr1 使用 50 tokens
      await mockToken.approve(addr1.address, ethers.parseEther("50"));

      // 尝试转账 100 tokens (超过授权额度)
      await expect(
        mockToken.connect(addr1).transferFrom(
          owner.address,
          addr2.address,
          ethers.parseEther("100")
        )
      ).to.be.reverted;
    });
  });

  describe("铸造", function () {
    it("应该能够铸造新代币", async function () {
      const initialSupply = await mockToken.totalSupply();
      
      // 铸造 1000 tokens 给 addr1
      await mockToken.mint(addr1.address, ethers.parseEther("1000"));
      
      // 检查总供应量
      const newSupply = await mockToken.totalSupply();
      expect(newSupply).to.equal(initialSupply + ethers.parseEther("1000"));
      
      // 检查 addr1 余额
      const addr1Balance = await mockToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(ethers.parseEther("1000"));
    });
  });
});
